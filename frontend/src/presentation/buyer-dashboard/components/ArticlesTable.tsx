'use client';
import { ArticleTableItems } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { ArticleTableStatus } from '@/interfaces/buyer-dashboard-interface/status-types';
import { useMemo, useState } from 'react';
import { SlOptions } from 'react-icons/sl';
import Pagination from './Pagination';

const TableHead = [
  'Title',
  'Your Bid',
  'Current Bid',
  'Time Remaining',
  'Status',
  'Action',
];

interface ArticleTableProps {
  data: ArticleTableItems[]; // * Array of Items to map for Articles Table Data
}

const ArticleTable = ({ data }: ArticleTableProps) => {
  const [rowsLimit] = useState(5);
  const [rowsToShow, setRowsToShow] = useState(data.slice(0, rowsLimit));
  const [customPagination, setCustomPagination] = useState<(number | null)[]>(
    [],
  ); // ? To fix when fix useMemo
  const [totalPages] = useState(Math.ceil(data?.length / rowsLimit));
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = data.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };

  const changePage = (value: number) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = data.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };

  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = data.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };

  // FIXME: I'm not sure to use useMemo or useEffect
  useMemo(() => {
    setCustomPagination(Array(Math.ceil(data.length / rowsLimit)).fill(null));
  }, []);

  function getStatusDecoraton(status: string) {
    switch (status) {
      case ArticleTableStatus.INPROGRESS:
        return 'bg-[#F1F5FF] text-[#2D5BC2] py-1.5 rounded-full';
      case ArticleTableStatus.WON:
        return 'bg-[#EDFEF6] text-[#28674A] py-1.5 rounded-full';
      case ArticleTableStatus.LOST:
        return 'bg-[#FFF3F4] text-[#90302C] py-1.5 rounded-full';
      case ArticleTableStatus.PENDING:
        return 'bg-[#FEFBEB] text-[#93603E] py-1.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-600 py-1.5 rounded-full';
    }
  }

  return (
    <div className="w-full bg-white mt-4 rounded-2xl pb-4">
      <div className="px-5 py-3">
        <h2 className="font-Forum text-4xl text-primary-font">Articles</h2>
        <p className="font-Montserrat text-lg text-primary-font">
          Keep track of recent biddings and other information.
        </p>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-tertiary">
            {TableHead.map((head) => (
              <th
                key={head}
                className="font-Forum text-start text-4xl px-8 py-1.5 border-y-1 border-[#5c5c5c]"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowsToShow.map((item) => {
            return (
              <tr
                key={item.id}
                className="border-b-1 border-[#5c5c5c] font-Montserrat "
              >
                <td className="px-8 py-1.5">{item.title}</td>
                <td className="px-8 py-1.5 min-w-[220px] text-2xl font-medium">
                  ฿ {item.yourBid}
                </td>
                <td className="px-8 py-1.5 min-w-[220px] text-2xl font-medium">
                  ฿ {item.currentBid}
                </td>
                <td className="px-8 py-1.5">{item.timeRemaining}</td>
                <td className="text-center">
                  <p className={getStatusDecoraton(item.bidStatus)}>
                    {item.bidStatus}
                  </p>
                </td>
                <td className="m-auto text-5xl text-[#5c5c5c]">
                  <div className="flex justify-center items-center">
                    <button onClick={() => console.log('Clicked!')}>
                      <SlOptions />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex justify-between items-center my-4 px-5">
        <div className="font-Montserrat text-lg">
          <p>
            Showing {currentPage === 0 ? 1 : currentPage * rowsLimit + 1} to{' '}
            {currentPage === totalPages - 1
              ? data?.length
              : (currentPage + 1) * rowsLimit}{' '}
            of {data?.length} Bids
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
          onClickNextPage={nextPage}
          onClickPreviousPage={previousPage}
        />
      </div>
    </div>
  );
};

export default ArticleTable;
