
import React, { useState } from 'react';
import ReportStats from '@/components/ReportStats';
import ReportGenerator from '@/components/ReportGenerator';
import ReportPreview from '@/components/ReportPreview';
import ScheduledReports from '@/components/ScheduledReports';

const ReportingPage: React.FC = () => {
  const [reportType, setReportType] = useState('feedback-summary');
  const [department, setDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [format, setFormat] = useState('pdf');
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reporting</h1>
      
      <ReportStats />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportGenerator 
          reportType={reportType}
          setReportType={setReportType}
          department={department}
          setDepartment={setDepartment}
          dateRange={dateRange}
          setDateRange={setDateRange}
          format={format}
          setFormat={setFormat}
        />
        
        <ReportPreview reportType={reportType} />
      </div>
      
      <ScheduledReports />
    </div>
  );
};

export default ReportingPage;
