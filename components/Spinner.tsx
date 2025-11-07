import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Đang tạo bởi Gemini..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary"></div>
      <p className="text-lg text-secondary">{message}</p>
    </div>
  );
};

export default Spinner;