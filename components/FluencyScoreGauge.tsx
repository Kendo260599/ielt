import React from 'react';

interface FluencyScoreGaugeProps {
  score: number; // Score from 0 to 1000
  size?: number;
}

const FluencyScoreGauge: React.FC<FluencyScoreGaugeProps> = ({ score, size = 160 }) => {
  const clampedScore = Math.max(0, Math.min(score, 1000));
  const percentage = clampedScore / 1000;

  const strokeWidth = size * 0.1;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage * circumference;

  const getScoreColor = () => {
    if (percentage < 0.3) return 'text-red-500';
    if (percentage < 0.7) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const scoreColor = getScoreColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <circle
          className="text-gray-200 dark:text-gray-600"
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          className={scoreColor}
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${scoreColor}`}>{clampedScore}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
};

export default FluencyScoreGauge;