import { ArticleTableStatus, InventoryTableStatus } from './status-types';

export interface InfoCardProps {
  cardTitle: string;
  cardDescription: string;
  icon: React.ElementType;
}

export interface ArticleTableItems {
  id: number;
  title: string;
  yourBid: number;
  currentBid: number;
  timeRemaining: string; // ? DateTime
  bidStatus: ArticleTableStatus | string;
}

export interface InventoryTableItems {
  id: number;
  title: string;
  purchasedDate: string; // ? DateTime
  contractPeriod: string; // ? DateTime
  contractStatus: InventoryTableStatus | string;
}

export interface BuyerDashboardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClickPreviousPage: () => void;
  onClickNextPage: () => void;
}
