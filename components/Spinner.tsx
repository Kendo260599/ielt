import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Đang tạo bởi Gemini..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <g transform="translate(100 100)">
                <path transform="translate(-75 -75)" d="M150 75L75 150L0 75L75 0Z" fill="none" stroke="var(--primary)" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" values="0 0 0; 0 0 0; -90 0 0; -90 0 0" dur="1.2s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="d" values="M150 75L75 150L0 75L75 0Z;M150 75L75 150L0 75L75 0Z;M150 75L75 150L0 75L75 0Z;M150 75L75 75L0 75L75 0Z" dur="1.2s" repeatCount="indefinite"></animate>
                </path>
                <path transform="translate(-75 -75)" d="M150 75L75 150L0 75L75 0Z" fill="none" stroke="var(--primary)" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" values="0 0 0; 0 0 0; 90 0 0; 90 0 0" dur="1.2s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="d" values="M150 75L75 150L0 75L75 0Z;M150 75L75 150L0 75L75 0Z;M150 75L75 150L0 75L75 0Z;M150 75L75 75L0 75L75 0Z" dur="1.2s" repeatCount="indefinite"></animate>
                </path>
            </g>
        </svg>
      </div>
      <p className="text-lg text-secondary">{message}</p>
    </div>
  );
};

export default Spinner;