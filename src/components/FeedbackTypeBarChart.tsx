import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeedbackTypeData {
  compliments: number;
  suggestions: number;
  complaints: number;
}

interface FeedbackTypeBarChartProps {
  data: FeedbackTypeData;
  title: string;
}

const FeedbackTypeBarChart: React.FC<FeedbackTypeBarChartProps> = ({ data, title }) => {
  const total = data.compliments + data.suggestions + data.complaints;
  const maxValue = Math.max(data.compliments, data.suggestions, data.complaints);
  
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

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 120 : 0;
  };

  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="flex items-end justify-between h-32 px-4">
            {/* Compliments Bar */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div 
                  className="w-16 bg-green-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${getBarHeight(data.compliments)}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                  {data.compliments}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">Compliments</span>
            </div>

            {/* Suggestions Bar */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div 
                  className="w-16 bg-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${getBarHeight(data.suggestions)}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                  {data.suggestions}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">Suggestions</span>
            </div>

            {/* Complaints Bar */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div 
                  className="w-16 bg-red-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${getBarHeight(data.complaints)}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                  {data.complaints}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">Complaints</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.compliments}</div>
              <div className="text-sm text-gray-600">Compliments</div>
              <div className="text-xs text-gray-500">{getPercentage(data.compliments).toFixed(1)}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.suggestions}</div>
              <div className="text-sm text-gray-600">Suggestions</div>
              <div className="text-xs text-gray-500">{getPercentage(data.suggestions).toFixed(1)}%</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{data.complaints}</div>
              <div className="text-sm text-gray-600">Complaints</div>
              <div className="text-xs text-gray-500">{getPercentage(data.complaints).toFixed(1)}%</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• Total feedbacks: <span className="font-medium">{total}</span></div>
              <div>• Positive feedback rate: <span className="font-medium text-green-600">{(getPercentage(data.compliments)).toFixed(1)}%</span></div>
              <div>• Most common type: <span className="font-medium">
                {data.compliments > data.suggestions && data.compliments > data.complaints ? 'Compliments' :
                 data.suggestions > data.complaints ? 'Suggestions' : 'Complaints'}
              </span></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackTypeBarChart; 