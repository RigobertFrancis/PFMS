import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentPieChartProps {
  data: SentimentData;
  title: string;
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ data, title }) => {
  const total = data.positive + data.negative + data.neutral;
  
  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const positivePercentage = (data.positive / total) * 100;
  const negativePercentage = (data.negative / total) * 100;
  const neutralPercentage = (data.neutral / total) * 100;

  // Calculate SVG circle parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  const positiveOffset = circumference - (positivePercentage / 100) * circumference;
  const negativeOffset = circumference - (negativePercentage / 100) * circumference;
  const neutralOffset = circumference - (neutralPercentage / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              
              {/* Positive segment */}
              {data.positive > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={circumference}
                  strokeDashoffset={positiveOffset}
                  strokeLinecap="round"
                />
              )}
              
              {/* Negative segment */}
              {data.negative > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={circumference}
                  strokeDashoffset={negativeOffset}
                  strokeLinecap="round"
                  transform={`rotate(${(positivePercentage / 100) * 360} 100 100)`}
                />
              )}
              
              {/* Neutral segment */}
              {data.neutral > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={circumference}
                  strokeDashoffset={neutralOffset}
                  strokeLinecap="round"
                  transform={`rotate(${((positivePercentage + negativePercentage) / 100) * 360} 100 100)`}
                />
              )}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Positive</span>
            </div>
            <div className="text-sm text-gray-600">
              {data.positive} ({positivePercentage.toFixed(1)}%)
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Negative</span>
            </div>
            <div className="text-sm text-gray-600">
              {data.negative} ({negativePercentage.toFixed(1)}%)
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Neutral</span>
            </div>
            <div className="text-sm text-gray-600">
              {data.neutral} ({neutralPercentage.toFixed(1)}%)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentPieChart; 