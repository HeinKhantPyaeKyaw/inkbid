'use client';

import { ReviewOverlayCardProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { useEffect, useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';

const ReviewOverlayCard = ({ onCancel, onSubmit }: ReviewOverlayCardProps) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ comment, rating });
    onCancel();
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center z-50">
      <div className="bg-secondary rounded-xl p-3 sm:p-4 shadow-xl w-full max-w-md md:max-w-lg relative">
        <div className="border-2 border-primary rounded-lg p-3 sm:p-4">
          <button
            className="absolute right-6 top-6"
            onClick={onCancel}
            aria-label="Close review form"
          >
            <RxCross2 className="text-primary text-2xl" />
          </button>
          <h1 className="font-Montserrat text-primary text-2xl sm:text-3xl font-bold text-center">
            Write a Review
          </h1>
          <form action="" onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="font-Montserrat text-primary text-base sm:text-lg font-medium">
                Click to Rate:{' '}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) =>
                  value <= rating ? (
                    <AiFillStar
                      key={value}
                      className="text-primary text-2xl cursor-pointer"
                      onClick={() => handleStarClick(value)}
                      aria-label={`${value} star selected`}
                    />
                  ) : (
                    <AiOutlineStar
                      key={value}
                      className="text-primary text-2xl cursor-pointer"
                      onClick={() => handleStarClick(value)}
                      aria-label={`${value} star`}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="w-full flex items-start gap-4 mt-4">
              <label
                htmlFor="Review"
                className="font-Forum font-semibold text-primary text-base sm:text-xl"
              >
                Review:{' '}
              </label>
              <textarea
                name="Review"
                id="Review"
                rows={5}
                className="mt-2 w-full bg-[#D9D9D9] p-3 rounded-md font-Montserrat text-primary text-base placeholder:text-primary/60"
                placeholder="Share you thought..."
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="block w-full sm:w-[220px] font-Montserrat text-primary text-lg font-bold mx-auto py-2 border-2 border-primary rounded-md hover:bg-primary/10 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewOverlayCard;
