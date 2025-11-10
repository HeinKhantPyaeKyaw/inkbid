import { BuyerDashboardPaginationProps } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onClickNextPage,
  onClickPreviousPage,
}: BuyerDashboardPaginationProps) => {
  return (
    <div className="flex">
      <ul
        className="flex justify-center items-center gap-x-[10px] z-30"
        role="navigation"
        aria-label="Pagination"
      >
        <li
          className={`flex items-center justify-center w-9 h-9 rounded-md border-[1px] border-solid border-[#E4E4EB] disabled: ${
            currentPage === 0
              ? 'bg-[#cccccc] pointer-events-none'
              : 'cursor-pointer'
          }`}
          onClick={onClickPreviousPage}
        >
          <RiArrowLeftSLine className="text-2xl font-bold" />
        </li>
        {Array.from({ length: totalPages }).map((data, index) => (
          <li
            key={index}
            className={`flex items-center justify-center w-9 h-9 rounded-md border-2 border-solid cursor-pointer text-lg ${
              currentPage === index
                ? 'text-primary font-bold border-primary'
                : 'border-[#E4E4EB]'
            }`}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </li>
        ))}
        <li
          className={`flex items-center justify-center w-9 h-9 rounded-md border-[1px] border-solid border-[#E4E4EB] disabled: ${
            currentPage === totalPages - 1
              ? 'bg-[#cccccc] pointer-events-none'
              : 'cursor-pointer'
          }`}
          onClick={onClickNextPage}
        >
          <RiArrowRightSLine className="text-2xl font-bold" />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
