'use client';

import {
  PortfolioModalProps,
  SellerPortfolioCarouselProps,
} from '@/interfaces/seller-profile-interface/seller-profile-types';
import { RxCross2 } from 'react-icons/rx';

const PortfolioModal = ({ portfolio, onClose }: PortfolioModalProps) => {
  if (!portfolio) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5  w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-tray-800 transition"
          onClick={onClose}
          aria-label="Close portfolio details"
        >
          <RxCross2 className="text-2xl" />
        </button>

        <h2 className="font-Forum text-2xl md:text-3xl text-gray-900 mb-3">
          {portfolio.title}
        </h2>

        <p className="text-gray-700 mb-4 font-Montserrat leading-relaxed">
          {portfolio.synopsis}
        </p>

        <p className="text-gray-600 mb-4">
          <strong>Published on:</strong> {portfolio.publishMedium || 'Unknown'}
        </p>

        {portfolio.pdfUrl ? (
          <a
            href={portfolio.pdfUrl}
            className="inline-flex justify-center items-center text-center bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 active:scale-[.99] transition font-Montserrat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        ) : (
          <p className="text-gray-400 italic mt-2">No file available.</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioModal;
