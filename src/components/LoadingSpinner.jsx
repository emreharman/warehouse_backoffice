import React from "react";

const LoadingSpinner = ({ size = 32 }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-white/60">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
