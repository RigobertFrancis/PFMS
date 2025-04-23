
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardCard from '@/components/DashboardCard';
import StatNumber from '@/components/StatNumber';
import FeedbackTypeChart from '@/components/FeedbackTypeChart';
import ProgressBar from '@/components/ProgressBar';
import GaugeChart from '@/components/GaugeChart';
import { departments, feedbackSummary, chartData } from '@/lib/mockData';

const Dashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('emergency');
  const currentDepartment = departments.find(d => d.id === selectedDepartment) || departments[0];
  
  const totalFeedbackPercentage = Math.floor((currentDepartment.totalFeedback / feedbackSummary.total) * 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Feedback">
          <div className="flex flex-col items-center">
            <StatNumber 
              value={feedbackSummary.total.toLocaleString()} 
              valueClassName="text-green-600" 
            />
            <Badge variant="outline" className="mt-2">April 2025</Badge>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Department">
          <div className="flex flex-col space-y-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex justify-center">
              <GaugeChart 
                value={currentDepartment.totalFeedback} 
                max={2000} 
                label={`${totalFeedbackPercentage}%`}
              />
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Requires Attention">
          <div className="flex flex-col items-center">
            <StatNumber 
              value={feedbackSummary.requiresAttention} 
              valueClassName="text-red-500" 
            />
            <span className="text-sm text-gray-500 mt-1">Last 2 days</span>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Response">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
              <span className="font-medium">2</span>
              <span className="text-sm text-gray-600">Response</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
              <span className="font-medium">7+</span>
              <span className="text-sm text-gray-600">Notifications</span>
            </div>
            
            <div className="flex justify-center mt-2">
              <span className="text-lg">...</span>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard title="" className="h-[350px]">
          <div className="flex justify-between mb-2">
            <div className="flex gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-suggestion rounded-full mr-2"></div>
                <span className="text-sm">Suggestions</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-complaint rounded-full mr-2"></div>
                <span className="text-sm">Complaints</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-compliment rounded-full mr-2"></div>
                <span className="text-sm">Compliments</span>
              </div>
            </div>
          </div>
          <FeedbackTypeChart data={chartData} height={280} />
        </DashboardCard>
        
        <DashboardCard title="Feedback Categories">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
                  <span className="font-medium">Complaints</span>
                </div>
                <span className="font-medium">{feedbackSummary.byType.complaints.toLocaleString()}</span>
              </div>
              <ProgressBar 
                value={feedbackSummary.byType.complaints} 
                max={feedbackSummary.total} 
                color="bg-feedback-complaint" 
                percentage={31}
              />
              <div className="text-xs text-gray-500">31% of total</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
                  <span className="font-medium">Suggestions</span>
                </div>
                <span className="font-medium">{feedbackSummary.byType.suggestions.toLocaleString()}</span>
              </div>
              <ProgressBar 
                value={feedbackSummary.byType.suggestions} 
                max={feedbackSummary.total} 
                color="bg-feedback-suggestion" 
                percentage={45}
              />
              <div className="text-xs text-gray-500">45% of total</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
                  <span className="font-medium">Compliments</span>
                </div>
                <span className="font-medium">{feedbackSummary.byType.compliments.toLocaleString()}</span>
              </div>
              <ProgressBar 
                value={feedbackSummary.byType.compliments} 
                max={feedbackSummary.total} 
                color="bg-feedback-compliment" 
                percentage={24}
              />
              <div className="text-xs text-gray-500">24% of total</div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
