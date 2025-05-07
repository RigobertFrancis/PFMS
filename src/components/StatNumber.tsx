
import React from 'react';

interface StatNumberProps {
  value: number | string;
  label?: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

const StatNumber: React.FC<StatNumberProps> = ({ 
  value, 
  label, 
  className = "", 
  valueClassName = "", 
  labelClassName = "" 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`text-4xl font-bold ${valueClassName}`}>
        {value}
      </div>
      {label && <div className={`text-sm text-gray-500 ${labelClassName}`}>{label}</div>}
    </div>
  );
};

export default StatNumber;
