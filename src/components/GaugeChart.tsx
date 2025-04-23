
import React from 'react';

interface GaugeChartProps {
  value: number;
  max: number;
  label?: string;
  size?: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, label, size = 150 }) => {
  const percentage = (value / max) * 100;
  const strokeWidth = size / 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const gradientId = `gauge-gradient-${value}`;
  
  // Determine color based on percentage
  let gradientColor1, gradientColor2;
  if (percentage < 33) {
    gradientColor1 = "#f03e3e";
    gradientColor2 = "#ff6b6b";
  } else if (percentage < 66) {
    gradientColor1 = "#f08c00";
    gradientColor2 = "#fcc419";
  } else {
    gradientColor1 = "#2b8a3e";
    gradientColor2 = "#40c057";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColor1} />
            <stop offset="100%" stopColor={gradientColor2} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e9ecef"
          strokeWidth={strokeWidth}
        />
        
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        
        {/* Percentage text */}
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize={size / 5}
          fontWeight="bold"
          fill="#495057"
          className="transform rotate-90"
        >
          {value}
        </text>
      </svg>
      {label && <div className="mt-2 text-sm text-gray-500">{label}</div>}
    </div>
  );
};

export default GaugeChart;
