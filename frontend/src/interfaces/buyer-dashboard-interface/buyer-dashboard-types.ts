import { ArticleTableStatus, InventoryTableStatus } from './status-types';

export interface InfoCardProps {
  cardTitle: string;
  cardDescription: string;
  icon: React.ElementType;
}

export interface ArticleTableItems {
  id: string;
  title: string;
  yourBid: number;
  currentBid: number;
  timeRemaining: string; // ? DateTime
  bidStatus: ArticleTableStatus | string;
}

export interface InventoryTableItems {
  id: string;
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

export type RawArticle = {
  _id?: string;
  title?: string;
  yourBid?: number;
  currentBid?: number;
  timeRemaining?: { $numberDecimal?: string } | number | string;
  status?: string;
};

export type RawInventory = {
  _id?: string;
  article: {
    title: string;
  };
  purchasedDate?: string;
  contractPeriod?: string;
  contractStatus?: string;
};
