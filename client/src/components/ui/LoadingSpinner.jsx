import React from 'react';

const LoadingSpinner = ({ size = 12, color = 'gray-800', bg = 'gray-200', className = '' }) => {
  const spinnerSize = `h-${size} w-${size}`;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-${bg} border-t-${color} ${spinnerSize}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;