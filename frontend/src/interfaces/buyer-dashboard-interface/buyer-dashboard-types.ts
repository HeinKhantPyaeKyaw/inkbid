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
  timeRemaining: string; 
  bidStatus: ArticleTableStatus | string;
  author: {
    name: string;
  };
  buyerSigned?: boolean;
  sellerSigned?: boolean;
}

export interface InventoryTableItems {
  id: string;
  title: string;
  purchasedDate: string; 
  contractPeriod: string; 
  contractStatus: InventoryTableStatus | string;
  contractUrl?: string;
  articleUrl?: string;
}

export interface BuyerDashboardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClickPreviousPage: () => void;
  onClickNextPage: () => void;
}

export type Author = { _id?: string; name?: string };
export interface ContractArticle {
  _id: string;
  title: string;
  highest_bid?: number;
  current_bid?: number;
  author: Author;
}

export type RawArticle = {
  _id?: string;
  title?: string;
  yourBid?: number;
  currentBid?: number;
  timeRemaining?: { $numberDecimal?: string } | number | string;
  status?: string;
  author: {
    name: string;
  };
  buyerSigned: boolean;
  sellerSigned: boolean;
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

export type ContractModalProps = {
  isOpen: boolean;
  onClose: () => void;
  article: ContractArticle | null;
  buyerName: string;
  onAgree?: () => void;
  signing: boolean;
};
