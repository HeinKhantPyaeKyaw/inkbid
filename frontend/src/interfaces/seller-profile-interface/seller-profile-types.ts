export interface SellerInfo {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  specialization: string;
  writingStyle: string;
  bio: string;
  img_url?: string;
}

export interface SellerProfileUpdateData {
  role?: 'seller' | 'buyer';
  firstName?: string;
  lastName?: string;
  name?: string;
  bio?: string;
  specialization?: string;
  writingStyle?: string;
  organization?: string;
  paypalEmail?: string;
  profileImage?: File;
}

export interface SellerPortfolioCarouselProps {
  _id: string;
  title: string;
  synopsis: string;
  publishMedium?: string;
  pdfUrl?: string;
}

export interface PortfolioModalProps {
  portfolio: SellerPortfolioCarouselProps | null;
  onClose: () => void;
}
export interface RatingReviewProps {
  ratings: number[];
  avgRating: number;
  totalReviews: number;
}

export interface ReviewCardProps {
  _id?: string;
  buyer?: {
    _id: string;
    name: string;
    email: string;
  };
  seller?: string;
  createdAt?: string;
  comment: string;
  rating: number;
}

export interface GetReviewsResponse {
  sellerId: string;
  avgRating: number;
  totalReviews: number;
  reviews: ReviewCardProps[];
}

export interface WritingReviewSectionProps {
  userRole?: string;
  sellerId: string;
  reviews: ReviewCardProps[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewCardProps[]>>;
  setAvgRating: React.Dispatch<React.SetStateAction<number>>;
  setTotalReviews: React.Dispatch<React.SetStateAction<number>>;
}

export interface ReviewOverlayCardProps {
  onCancel: () => void;
  onSubmit: (data: ReviewCardProps) => void;
}
