'use client';
import { useAuth } from '@/context/auth/AuthContext';
import { useBuyerDashboardAPI } from '@/hooks/buyer-dashboard-hooks/buyer-dashboard.api';
import {
  ArticleTableItems,
  ContractArticle,
  InventoryTableItems,
} from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import {
  ArticleTableStatus,
  InventoryTableStatus,
} from '@/interfaces/buyer-dashboard-interface/status-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { SlOptions } from 'react-icons/sl';
import ContractModal from './ContractModal';
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
  setArticlesTableData: React.Dispatch<
    React.SetStateAction<ArticleTableItems[]>
  >;
  setInventoryTableData: React.Dispatch<
    React.SetStateAction<InventoryTableItems[]>
  >;
}

const ArticleTable = ({
  data,
  setArticlesTableData,
  setInventoryTableData,
}: ArticleTableProps) => {
  const [rowsLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  // For ActionButton Dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State to track selected article and modal visibility
  const [selectedArticle, setSelectedArticle] =
    useState<ContractArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // To track modal's "Agree" button is loading
  const [signing, setSigning] = useState(false);

  const { user } = useAuth();
  const buyerName = user?.name ?? 'Buyer';

  const { signContractAPI, proceedPaymentAPI } = useBuyerDashboardAPI();

  const rowsToShow = useMemo(() => {
    const startIndex = currentPage * rowsLimit;
    return data.slice(startIndex, startIndex + rowsLimit);
  }, [data, currentPage, rowsLimit]);

  const totalPages = Math.ceil(data.length / rowsLimit);

  // To handle closing dropdown wherever click
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Action Button{Sign Contract & Proceed with payment}
  const handleSignContract = async (id: string) => {
    const foundArticle = data.find((item) => item.id === id);

    if (!foundArticle) return;
    const articleForContract: ContractArticle = {
      _id: foundArticle.id,
      title: foundArticle.title,
      highest_bid: foundArticle.currentBid,
      author: { name: foundArticle.author.name },
    };
    setSelectedArticle(articleForContract);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  // Handle "Agree" button click
  const handleAgreeContract = async () => {
    if (!selectedArticle) return;
    setSigning(true);

    try {
      const res = await signContractAPI(selectedArticle._id);
      console.log('Contract signed response: ', res);

      setArticlesTableData((prev) =>
        prev.map((a) =>
          a.id === selectedArticle._id
            ? { ...a, bidStatus: ArticleTableStatus.PENDING }
            : a,
        ),
      );

      toast.success('Contract Signed successfully');
      setIsModalOpen(false);
      setSelectedArticle(null);
    } catch (err) {
      console.error('Error signing contract: ', err);
      toast.error('Failed to sign contract. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const handleProceedPayment = async (id: string) => {
    setLoadingAction(id);
    setError(null);
    try {
      const res = await proceedPaymentAPI(id);

      const newItem = res.inventory;
      console.log('New inventory from backend: ', newItem);

      setArticlesTableData((prev) =>
        prev.filter((article) => article.id !== id),
      );
      setInventoryTableData((prev) => [
        ...prev,
        {
          id: String(newItem._id),
          title: String(newItem.article.title ?? 'Untitled'),
          purchasedDate: new Date(newItem.purchasedDate).toLocaleDateString(),
          contractPeriod: String(newItem.contractPeriod ?? '30 Days'),
          contractStatus: String(
            newItem.contractStatus
              ? newItem.contractStatus.charAt(0).toUpperCase() +
                  newItem.contractStatus.slice(1).toLowerCase()
              : 'Active',
          ),
        },
      ]);
    } catch (err) {
      console.error('Failed to process payment', err);
      setError('Payment failed. Please try again');
    } finally {
      setLoadingAction(null);
      setOpenDropdown(null);
    }
  };

  // Pagination to change page in the tables
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

  // For Action Buttons Rendering
  function renderActionButton(item: ArticleTableItems) {
    const isLoading = loadingAction === item.id;
    switch (item.bidStatus) {
      case ArticleTableStatus.WON:
        return (
          <div
            className="relative"
            ref={(el) => {
              dropdownRefs.current[item.id] = el;
            }}
          >
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === item.id ? null : item.id)
              }
              className="cursor-pointer "
              disabled={isLoading} // ? Might fix later
            >
              <SlOptions />
            </button>
            {openDropdown === item.id && (
              <div className="absolute top-8 -right-3 w-48 rounded-lg z-50">
                <button
                  className="whitespace-nowrap px-8 py-2 rounded-[8px] text-lg text-primary font-Montserrat font-bold border-2 border-[#B9B9B9] bg-[#ffffff] hover:bg-gray-100 active:scale-95 cursor-pointer transition"
                  onClick={() => handleSignContract(item.id)}
                  aria-label={`Sign contract for article ${item.title}`}
                >
                  Sign Contract
                </button>
              </div>
            )}
          </div>
        );
      case ArticleTableStatus.PENDING:
        return (
          <div
            className="relative"
            ref={(el) => {
              dropdownRefs.current[item.id] = el;
            }}
          >
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === item.id ? null : item.id)
              }
              className="cursor-pointer"
            >
              <SlOptions />
            </button>
            {openDropdown === item.id && (
              <div className="absolute top-8 right-16 w-48 rounded-lg z-50">
                <button
                  className="whitespace-nowrap px-8 py-2 rounded-[8px] text-lg text-primary font-Montserrat font-bold border-2 border-[#B9B9B9] bg-[#ffffff] hover:bg-gray-100 active:scale-95 cursor-pointer transition"
                  onClick={() => handleProceedPayment(item.id)}
                  aria-label={`Proceed with payment for article ${item.title}`}
                >
                  Proceed with Payment
                </button>
              </div>
            )}
          </div>
        );
      case ArticleTableStatus.INPROGRESS:
      case ArticleTableStatus.LOST:
      default:
        return <span className="text-gray-400"></span>;
    }
  }

  return (
    <div className="w-full bg-white mt-4 rounded-2xl pb-4">
      <div className="px-5 py-3">
        <h2 className="font-Forum text-4xl text-primary-font">Articles</h2>
        <p className="font-Montserrat text-lg text-primary-font">
          Keep track of recent biddings and other information.
        </p>
        {/* Show error messgage if exists */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <table className="table-auto w-full focus-within:shadow-md transition-shadow">
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
                <td className="px-8 py-1.5 text-xl font-bold">
                  {item.timeRemaining}
                </td>
                <td className="text-center">
                  <p className={getStatusDecoraton(item.bidStatus)}>
                    {item.bidStatus}
                  </p>
                </td>
                <td className="m-auto text-5xl text-[#5c5c5c]">
                  <div className="flex justify-center items-center">
                    {renderActionButton(item)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ------------------------ Contract Modal ------------------------ */}
      <ContractModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        article={selectedArticle}
        buyerName={buyerName}
        onAgree={handleAgreeContract}
      />

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
