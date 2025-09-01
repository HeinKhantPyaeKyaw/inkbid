'use client';

import { ReviewOverlayCardProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';

const ReviewOverlayCard = ({ onCancel, onSubmit }: ReviewOverlayCardProps) => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, review, rating });
    onCancel();
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-filter backdrop-blur-sm  flex justify-center items-center z-50">
      <div className="bg-secondary rounded-[8px] p-2 shadow-lg w-[500px] relative">
        <div className="border-2 border-primary rounded-[6px] p-2">
          <button className="absolute right-4" onClick={onCancel}>
            <RxCross2 className="text-primary text-2xl" />
          </button>
          <h1 className="font-Montserrat text-primary text-2xl font-bold text-center">
            Write a Review
          </h1>
          <form action="" onSubmit={handleSubmit}>
            <div className="flex justify-start items-center gap-4 mt-4">
              <p className="font-Montserrat text-primary text-lg font-medium">
                Click to Rate:{' '}
              </p>
              {/* TODO: To implement button for stars to be clickable */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) =>
                  value <= rating ? (
                    <AiFillStar
                      key={value}
                      className="text-primary text-2xl"
                      onClick={() => handleStarClick(value)}
                    />
                  ) : (
                    <AiOutlineStar
                      key={value}
                      className="text-primary text-2xl"
                      onClick={() => handleStarClick(value)}
                    />
                  ),
                )}
              </div>
            </div>
            <div className="w-full flex items-start gap-4 mt-4">
              <label
                htmlFor="Name"
                className="w-[75px] font-Forum text-primary text-lg"
              >
                Name:{' '}
              </label>
              <input
                name="Name"
                id="Name"
                className="w-full bg-[#D9D9D9] p-2 font-Montserrat text-primary text-md"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full flex items-start gap-4 mt-4">
              <label
                htmlFor="Review"
                className="w-[75px] font-Forum text-primary text-lg"
              >
                Review:{' '}
              </label>
              <textarea
                name="Review"
                id="Review"
                className="w-full bg-[#D9D9D9] p-2 font-Montserrat text-primary text-md"
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
            <button className="block w-[200px] font-Montserrat text-primary text-lg font-bold mx-auto mt-4 py-1  border-2 border-primary rounded-[6px]">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewOverlayCard;
