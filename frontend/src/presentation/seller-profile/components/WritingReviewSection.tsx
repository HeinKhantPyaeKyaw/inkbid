'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { createReviewAPI, getSellerReviews } from '@/hooks/review.api';
import { WritingReviewSectionProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { useEffect, useState } from 'react';
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
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

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
      setOpen(false);
      // setReviews((prev) => [savedReview, ...prev]);
    } catch (error) {
      console.error('Error writing review: ', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        {/* FIXME: Think to add Click to rate with stars here or not */}
        <h2 className="font-Montserrat text-white text-xl md:text-2xl">
          Recent Reviews
        </h2>
        {userRole === 'buyer' && (
          <div>
            <button
              className="bg-secondary rounded-md p-[2px] w-[240px]"
              onClick={handleOpen}
            >
              <div className="flex justify-center items-center gap-2 text-primary font-Montserrat font-bold border-2 border-primary rounded-[6px] py-2 hover:bg-primary/10 transition">
                <FaPenToSquare className="inline-flex" />
                Write a Review
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            buyer={review.buyer}
            comment={review.comment}
            rating={review.rating}
          />
        ))}
      </div>

      {open ? (
        <ReviewOverlayCard
          onCancel={() => setOpen(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
};

export default WritingReviewSection;
