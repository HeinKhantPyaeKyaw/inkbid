'use client';

import { RatingReviewProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { AiFillStar } from 'react-icons/ai';

const RatingReview = ({
  ratings,
  avgRating,
  totalReviews,
}: RatingReviewProps) => {
  const totalRatings = ratings.length;

  const stars = [5, 4, 3, 2, 1];
  const ratingCounts = stars.map(
    (star) => ratings.filter((r) => star === r).length,
  );

  return (
    <div className="w-full py-5 px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
      <div className="flex flex-col items-center text-white shrink-0">
        {/* FIX: To fix Rating to be reactive according to the total ratings */}
        <h2 className="font-Montserrat text-2xl md:text-3xl">
          Rating & Reviews
        </h2>
        <p className="font-Montserrat text-5xl md:text-6xl font-bold leading-none my-2">
          {avgRating === 0 ? 0 : avgRating.toFixed(1)}
        </p>
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <AiFillStar
              key={i}
              className={`text-xl ${
                i < Math.round(avgRating) ? 'text-yellow-300' : 'text-white/30'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 font-Montserrat text-xl">
          {totalReviews} {totalReviews === 1 ? 'Rating' : 'Ratings'}
        </p>
      </div>

      <div className="flex-1 w-full md:max-w-xl">
        <ul className="flex flex-col gap-3">
          {ratingCounts.map((count, index) => {
            const star = 5 - index;
            const percentage =
              totalRatings > 0 ? (count / totalRatings) * 100 : 0;
            const barWidth =
              percentage === 0 ? '0%' : `max(${percentage.toFixed(1)}%, 6%)`;

            return (
              <li
                key={star}
                className="flex items-center gap-3 text-white"
                role="listitem"
              >
                <span className="w-[100px] flex">
                  {[
                    Array.from({ length: star }).map((_, index) =>
                      index < star ? (
                        <AiFillStar key={index} className="text-white" />
                      ) : null,
                    ),
                  ]}
                </span>
                <div
                  className="w-full h-2 bg-white/20 rounded overflow-hidden"
                  role="progressbar"
                  aria-label={`${star} star percentage`}
                  aria-valuenow={Math.round(percentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-yellow-300"
                    style={{ width: barWidth }}
                  ></div>
                </div>
                <span className="w-10 text-right text-sm md:text-base tabular-nums">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RatingReview;
