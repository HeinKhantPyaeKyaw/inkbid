'use client';

import { SellerPortfolioCarouselProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import PortfolioModal from './PortfolioModal';

interface CarouselDataItems {
  data: SellerPortfolioCarouselProps[];
}

const SellerProfileCarousel = ({ data }: CarouselDataItems) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<SellerPortfolioCarouselProps | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-white py-10 font-Montserrat">
        No portfolios available.
      </div>
    );
  }
  const currentPortfolio = data[currentIndex] || {
    title: 'Untitled work',
    synopsis: 'No synopsis provided.',
  };

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

  const handleReadMore = () => {
    setSelectedPortfolio(currentPortfolio);
  };

  return (
    <div className="w-full min-h-[240px] md:min-h-[260px] flex justify-between items-center px-4 sm:px-6 md:px-7 gap-4 md:gap-5 bg-secondary/95 rounded-xl ring-1 ring-white/10 text-center  shadow-[inset_8px_0_50px_rgba(0,0,0,0.25),inset_-8px_0_50px_rgba(0,0,0,0.25),inset_0_12px_50px_rgba(0,0,0,0.25),inset_0_-12px_50px_rgba(0,0,0,0.25)] relative">
      <div>
        <button
          onClick={decreaseIndex}
          className="p-1 rounded-md hover:bg-white/10 active:scale-95 transition"
          aria-label="Previous portfolio"
        >
          <RiArrowLeftSLine className="text-4x. md:text-6xl text-[#5c5c5c]" />
        </button>
      </div>

      <div className="flex flex-col justify-center items-center gap-3 md:gap-4 flex-1 text-center">
        <h2 className="font-Forum text-2xl md:text-4xl text-primary-font text-shadow-[0_6px_0_rgba(0,0,0,0.25)]">
          {currentPortfolio.title || 'Untitled work'}
        </h2>
        <p className="max-w-3xl font-Montserrat text-base md:text-lg text-primary-font/90 tex-shadow-[0_2px_10px_rgba(0,0,0,0.5)] line-clamp-3">
          {currentPortfolio.synopsis || 'No synopsis provided.'}
        </p>
        <button
          className="font-Montserrat text-sm md:text-lg text-primary-font underline underline-offset-4 hover:opacity-80 transition"
          onClick={handleReadMore}
        >
          Read More
        </button>
      </div>

      <div>
        <button
          onClick={increaseIndex}
          className="p-1 rounded-md hover:bg-white/10 active:scale-95 transition"
          aria-label="Next portfolio"
        >
          <RiArrowRightSLine className="text-4xl md:text-6xl text-[#5c5c5c]" />
        </button>
      </div>

      {selectedPortfolio && (
        <PortfolioModal
          portfolio={selectedPortfolio}
          onClose={() => setSelectedPortfolio(null)}
        />
      )}
    </div>
  );
};

export default SellerProfileCarousel;
