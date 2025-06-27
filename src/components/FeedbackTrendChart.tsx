import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendDataPoint {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface FeedbackTrendChartProps {
  data: TrendDataPoint[];
  title: string;
}

const FeedbackTrendChart: React.FC<FeedbackTrendChartProps> = ({ data, title }) => {
  if (data.length === 0) {
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

  const maxValue = Math.max(
    ...data.flatMap(d => [d.positive, d.negative, d.neutral])
  );

  const getYPosition = (value: number) => {
    return maxValue > 0 ? 200 - (value / maxValue) * 160 : 200;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={40 + i * 40}
                x2="100%"
                y2={40 + i * 40}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => (
              <text
                key={i}
                x="10"
                y={45 + i * 40}
                fontSize="12"
                fill="#6b7280"
                textAnchor="start"
              >
                {Math.round((maxValue / 4) * (4 - i))}
              </text>
            ))}

            {/* Positive trend line */}
            {data.length > 1 && (
              <polyline
                points={data.map((d, i) => `${60 + (i * 200) / (data.length - 1)},${getYPosition(d.positive)}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Negative trend line */}
            {data.length > 1 && (
              <polyline
                points={data.map((d, i) => `${60 + (i * 200) / (data.length - 1)},${getYPosition(d.negative)}`).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Neutral trend line */}
            {data.length > 1 && (
              <polyline
                points={data.map((d, i) => `${60 + (i * 200) / (data.length - 1)},${getYPosition(d.neutral)}`).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {data.map((d, i) => (
              <g key={i}>
                {/* Positive points */}
                <circle
                  cx={60 + (i * 200) / (data.length - 1)}
                  cy={getYPosition(d.positive)}
                  r="4"
                  fill="#10b981"
                />
                
                {/* Negative points */}
                <circle
                  cx={60 + (i * 200) / (data.length - 1)}
                  cy={getYPosition(d.negative)}
                  r="4"
                  fill="#ef4444"
                />
                
                {/* Neutral points */}
                <circle
                  cx={60 + (i * 200) / (data.length - 1)}
                  cy={getYPosition(d.neutral)}
                  r="4"
                  fill="#f59e0b"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={60 + (i * 200) / (data.length - 1)}
                y="250"
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {formatDate(d.date)}
              </text>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Neutral</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total data points:</span>
              <span className="font-medium">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Date range:</span>
              <span className="font-medium">
                {data.length > 0 ? `${formatDate(data[0].date)} - ${formatDate(data[data.length - 1].date)}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackTrendChart; 