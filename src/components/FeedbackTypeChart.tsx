import React from 'react';
import { LineChart, Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/lib/types';

interface FeedbackTypeChartProps {
  data: ChartData[] | null;
  height?: number;
}

const FeedbackTypeChart: React.FC<FeedbackTypeChartProps> = ({ data, height = 300 }) => {
  // Return loading state if data is null or empty
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading chart data...
      </div>
    );
  }

  // Transform data to include proper period labels
  const transformedData = data.map(item => ({
    ...item,
    period: item.period || `${item.week || 1}`
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={transformedData}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="suggestions"
          stroke="#4dabf7"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="complaints"
          stroke="#ff6b6b"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="compliments"
          stroke="#40c057"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FeedbackTypeChart;
