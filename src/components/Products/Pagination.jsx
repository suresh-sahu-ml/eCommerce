import React from 'react';

export default function Pagination({ currentPage, setCurrentPage }) {
  const totalPages = 3;

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full flex justify-center pb-section-gap">
      <div className="flex items-center gap-4 font-label-sm text-label-sm">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border border-outline/20 text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`w-8 text-center pb-1 transition-colors ${
              currentPage === page
                ? 'text-primary border-b border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center border border-outline/20 text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
