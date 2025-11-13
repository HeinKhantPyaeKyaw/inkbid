import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* ---- Info Cards Skeleton ---- */}
      <div className="flex justify-between items-center">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="w-[360px] h-[120px] bg-gray-200 rounded-2xl shadow-sm"
          ></div>
        ))}
      </div>

      {/* ---- Articles Table Skeleton ---- */}
      <div className="bg-white rounded-2xl p-5">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-100 rounded-md mb-3"></div>
        ))}
      </div>

      {/* ---- Inventory Table Skeleton ---- */}
      <div className="bg-white rounded-2xl p-5">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-100 rounded-md mb-3"></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
