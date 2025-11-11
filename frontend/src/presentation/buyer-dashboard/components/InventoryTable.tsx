'use client';

import { useBuyerDashboardAPI } from '@/hooks/buyer-dashboard-hooks/buyer-dashboard.api';
import { InventoryTableItems } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { InventoryTableStatus } from '@/interfaces/buyer-dashboard-interface/status-types';
import { useMemo, useState } from 'react';
import { GrArticle } from 'react-icons/gr';
import { TbContract } from 'react-icons/tb';
import Pagination from './Pagination';

const TableHead = ['Title', 'Purchased Date', 'Status', 'Action'];

interface InventoryTableProps {
  data: InventoryTableItems[];
}

const InventoryTable = ({ data }: InventoryTableProps) => {
  const [rowsLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { downloadArticleAPI, downloadContractAPI } = useBuyerDashboardAPI();

  const rowsToShow = useMemo(() => {
    const startIndex = currentPage * rowsLimit;
    return data.slice(startIndex, startIndex + rowsLimit);
  }, [data, currentPage, rowsLimit]);

  const totalPages = Math.ceil(data.length / rowsLimit);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const changePage = (value: number) => {
    if (value >= 0 && value < totalPages) {
      setCurrentPage(value);
    }
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const getStatusDecoration = (status: string) => {
    switch (status) {
      case InventoryTableStatus.ACTIVE:
        return 'bg-[#EDFEF6] text-[#28674A] py-1.5 rounded-full';
      case InventoryTableStatus.EXPIRED:
        return 'bg-[#FFF3F4] text-[#90302C] py-1.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-500 py-1.5 rounded-full';
    }
  };

  const renderActionButtons = (item: InventoryTableItems) => {
    const isLoading = loadingAction === item.id;
    if (item.contractStatus === InventoryTableStatus.ACTIVE) {
      return (
        <div className="flex gap-3 justify-center items-center">
          <button
            onClick={async () => {
              setLoadingAction(item.id);
              setError(null);
              try {
                await downloadContractAPI(item.contractUrl);
              } catch (err) {
                console.error('Failed to download contract', err);
                setError('Failed to download contract. Please try again');
              } finally {
                setLoadingAction(null);
              }
            }}
            className="flex-col justify-center items-center cursor-pointer hover:text-primary active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label={`Download contract for ${item.title}`}
            disabled={isLoading}
          >
            <TbContract className="text-black" />
            <p className="font-Montserrat font-bold text-sm text-black">
              {isLoading ? 'Downloading...' : 'Contract'}
            </p>
          </button>
          <button
            onClick={async () => {
              setLoadingAction(item.id);
              setError(null);
              try {
                await downloadArticleAPI(item.articleUrl);
              } catch (err) {
                console.error('Failed to download ', err);
                setError('Failed to download article. Please try again.');
              } finally {
                setLoadingAction(null);
              }
            }}
            className="flex-col justify-center items-center cursor-pointer hover:text-primary active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary transition"
            aria-label={`Download article ${item.title}`}
            disabled={isLoading}
          >
            <GrArticle className="text-black" />
            <p className="font-Montserrat font-bold text-sm text-black">
              {isLoading ? 'Downloading...' : 'Article'}
            </p>
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-3 justify-center items-center">
          <button className="flex-col justify-center items-center disabled cursor-not-allowed">
            <TbContract className="text-gray-400" />
            <p className="font-Montserrat font-bold text-sm text-gray-400">
              Contract
            </p>
          </button>
          <button className="flex-col justify-center items-center disabled cursor-not-allowed">
            <GrArticle className="text-gray-400" />
            <p className="font-Montserrat font-bold text-sm text-gray-400">
              Article
            </p>
          </button>
        </div>
      );
    }
  };

  return (
    <div className="w-full bg-white mt-4 rounded-2xl pb-4">
      <div className="px-5 py-3">
        <h2 className="font-Forum text-4xl text-primary-font">Inventory</h2>
        <p className="font-Montserrat text-lg text-primary-font">
          Keep track of purchased articles and other information.
        </p>
        {/* Show Error if exists */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full focus-within:shadow-md transition-shadow min-w-[720px]">
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
                  <td className="px-8 py-1.5 min-w-[220px] text-xl font-bold ">
                    {item.purchasedDate}
                  </td>
                  <td className="text-center">
                    <p className={getStatusDecoration(item.contractStatus)}>
                      {item.contractStatus}
                    </p>
                  </td>
                  <td className="m-auto text-5xl text-[#5c5c5c]">
                    {renderActionButtons(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-between items-center my-4 px-5">
        <div className="font-Montserrat text-lg">
          <p>
            Showing {currentPage === 0 ? 1 : currentPage * rowsLimit + 1} to{' '}
            {currentPage === totalPages - 1
              ? data?.length
              : (currentPage + 1) * rowsLimit}{' '}
            of {data?.length} Articles
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

export default InventoryTable;
