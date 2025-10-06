'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { createReviewAPI, getSellerReviews } from '@/hooks/review.api';
import { WritingReviewSectionProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { useState } from 'react';
import { FaPenToSquare } from 'react-icons/fa6';
import ReviewCard from './ReviewCard';
import ReviewOverlayCard from './ReviewOverlayCard';

const WritingReviewSection = ({
  userRole,
  sellerId,
  reviews,
  setReviews,
  setAvgRating,
  setTotalReviews,
}: WritingReviewSectionProps) => {
  // const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
    console.log(open);
  };

  const handleSubmit = async (newReview: {
    rating: number;
    comment: string;
  }) => {
    try {
      await createReviewAPI({
        sellerId,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      const data = await getSellerReviews(sellerId);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);

      // setReviews((prev) => [savedReview, ...prev]);
    } catch (error) {
      console.error('Error writing review: ', error);
    }
  };

  return (
    <div className="w-full py-5 px-5">
      <div className="flex justify-between items-center">
        {/* FIXME: Think to add Click to rate with stars here or not */}
        <div className="">
          <h2>Click to Rate: </h2>
        </div>
        {userRole === 'buyer' && (
          <div>
            <button
              className="bg-secondary rounded-[6px] p-1 w-[240px]"
              onClick={handleOpen}
            >
              <div className="flex justify-center items-center gap-1 text-primary font-Montserrat font-bold border-2 border-primary rounded-[4px] py-0.5">
                <FaPenToSquare className="inline-flex" />
                Write a Reivew
              </div>
            </button>
          </div>
        )}
        {open ? (
          <ReviewOverlayCard
            onCancel={() => setOpen(false)}
            onSubmit={handleSubmit}
          />
        ) : null}
      </div>
      <div className="mt-5">
        {reviews.map((review, index) => (
          <ReviewCard
            key={review._id}
            buyer={review.buyer}
            comment={review.comment}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default WritingReviewSection;
