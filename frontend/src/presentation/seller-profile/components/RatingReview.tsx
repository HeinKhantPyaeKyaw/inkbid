'use client';

import { RatingReviewProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { AiFillStar } from 'react-icons/ai';

const RatingReview = ({ ratings }: RatingReviewProps) => {
  const totalRatings = ratings.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => ratings.filter((r) => star === r).length,
  );

  return (
    <div className="w-full flex justify-between items-center py-5 px-5">
      <div className="flex flex-col justify-center items-center text-white">
        {/* FIX: To fix Rating to be reactive according to the total ratings */}
        <h2 className="font-Montserrat text-4xl">Rating & Reviews</h2>
        <p className="font-Montserrat text-[64px] font-bold">3.5</p>
        <p className="font-Montserrat text-xl">14 Ratings</p>
      </div>
      <div className="flex flex-col gap-2 flex-1 max-w-[500px]">
        {ratingCounts.map((count, index) => {
          const star = 5 - index;
          const percentage =
            totalRatings > 0 ? (count / totalRatings) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-white">
              <div className="w-[100px] flex">
                {[
                  Array.from({ length: star }).map((_, index) =>
                    index < star ? (
                      <AiFillStar key={index} className="text-white" />
                    ) : null,
                  ),
                ]}
              </div>
              <div className="w-full bg-gray-300 rounded h-2 overflow-hidden">
                <div
                  className="h-full bg-yellow-200"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingReview;
