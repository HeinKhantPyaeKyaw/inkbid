'use client';

import { SellerProfileCarouselProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

interface CarouselDataItems {
  data: SellerProfileCarouselProps[];
}

const SellerProfileCarousel = ({ data }: CarouselDataItems) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const decreaseIndex = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(data.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const increaseIndex = () => {
    if (currentIndex === data.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="w-full h-[280px] flex justify-between items-center px-7 gap-5 bg-secondary text-center  shadow-[inset_8px_0_50px_rgba(0,0,0,0.25),inset_-8px_0_50px_rgba(0,0,0,0.25),inset_0_12px_50px_rgba(0,0,0,0.25),inset_0_-12px_50px_rgba(0,0,0,0.25)] relative">
      <div className="">
        <button onClick={decreaseIndex}>
          <RiArrowLeftSLine className="text-6xl text-[#5c5c5c]" />
        </button>
      </div>
      {data.map((item, index) => {
        if (currentIndex === index) {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-4"
            >
              <h2 className="font-Forum text-4xl text-primary-font text-shadow-[0_6px_0_rgba(0,0,0,0.25)]">
                {item.header}
              </h2>
              <p className="w-5xl font-Montserrat text-2xl text-primary-font tex-shadow-[0_2px_10px_rgba(0,0,0,0.5)] line-clamp-3">
                {item.body}
              </p>
              <button className="font-Montserrat text-lg text-primary-font">
                -Read more-
              </button>
            </div>
          );
        }
      })}
      <div className="">
        <button onClick={increaseIndex}>
          <RiArrowRightSLine className="text-6xl text-[#5c5c5c]" />
        </button>
      </div>
    </div>
  );
};

export default SellerProfileCarousel;
