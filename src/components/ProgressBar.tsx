
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  percentage?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  color = "bg-blue-500", 
  label,
  percentage,
  className = ""
}) => {
  const calculatedPercentage = percentage || Math.round((value / max) * 100);
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{calculatedPercentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${calculatedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
