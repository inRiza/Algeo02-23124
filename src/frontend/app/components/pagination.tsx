import React from 'react'

export function Pagination() {
    return (
      <div className="mt-6 flex items-center justify-center gap-4">
        <button className="text-[#B3B3B3] hover:text-white transition-colors">
          <ChevronLeftIcon />
        </button>
        <span className="text-[#B3B3B3]">Page 1 of 120</span>
        <button className="text-[#B3B3B3] hover:text-white transition-colors">
          <ChevronRightIcon />
        </button>
      </div>
    );
}

// Icon components
export const PlayIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);