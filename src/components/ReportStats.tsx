
import React from 'react';
import DashboardCard from '@/components/DashboardCard';

const ReportStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <DashboardCard title="Generated Reports">
        <div className="text-4xl font-bold text-med-blue">24</div>
        <div className="text-sm text-gray-500">This month</div>
      </DashboardCard>
      
      <DashboardCard title="Scheduled Reports">
        <div className="text-4xl font-bold text-orange-500">8</div>
        <div className="text-sm text-gray-500">Active schedules</div>
      </DashboardCard>
      
      <DashboardCard title="Shared Reports">
        <div className="text-4xl font-bold text-green-500">12</div>
        <div className="text-sm text-gray-500">This month</div>
      </DashboardCard>
      
      <DashboardCard title="Report Types">
        <div className="text-4xl font-bold text-purple-500">5</div>
        <div className="text-sm text-gray-500">Available types</div>
      </DashboardCard>
    </div>
  );
};

export default ReportStats;
