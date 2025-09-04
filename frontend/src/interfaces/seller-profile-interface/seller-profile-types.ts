export interface SellerInfo {
  name: string;
  specialization: string;
  writingStyle: string;
  bio: string;
  imageUrl: string;
}

export interface SellerProfileCarouselProps {
  header: string;
  body: string;
}

export interface RatingReviewProps {
  ratings: number[];
}

export interface ReviewCardProps {
  // id: number;
  // createdAt: string;
  name: string;
  review: string;
  rating: number;
}

export interface WritingReviewSectionProps {
  reviews: ReviewCardProps[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewCardProps[]>>;
}

export interface ReviewOverlayCardProps {
  onCancel: () => void;
  onSubmit: (data: ReviewCardProps) => void;
}
