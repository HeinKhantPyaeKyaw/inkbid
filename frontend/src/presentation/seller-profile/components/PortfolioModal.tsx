'use client';

import {
  PortfolioModalProps,
  SellerPortfolioCarouselProps,
} from '@/interfaces/seller-profile-interface/seller-profile-types';
import { RxCross2 } from 'react-icons/rx';

const PortfolioModal = ({ portfolio, onClose }: PortfolioModalProps) => {
  if (!portfolio) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto relative p-6">
        <button
          className="absolute top-3 right-3 text-gray-600 mb-2"
          onClick={onClose}
        >
          <RxCross2 className="text-2xl" />
        </button>

        <h2 className="font-Forum text-3xl text-gray-900 mb-2">
          {portfolio.title}
        </h2>

        <p className="text-gray-700 mb-3 font-Montserrat leading-relaxed">
          {portfolio.synopsis}
        </p>

        <p className="text-gray-600 mb-2">
          <strong>Published on:</strong> {portfolio.publishMedium || 'Unknown'}
        </p>

        {portfolio.pdfUrl ? (
          <a
            href={portfolio.pdfUrl}
            className="block text-center bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition font-Montserrat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        ) : (
          <p className="text-gray-400 italic text-center mt-3">
            No file available.
          </p>
        )}
      </div>
    </div>
  );
};

export default PortfolioModal;
