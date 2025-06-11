
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import DepartmentSelector from '@/components/DepartmentSelector';
import { generateReport, downloadReport } from '@/utils/reportGenerator';

interface ReportGeneratorProps {
  reportType: string;
  setReportType: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  dateRange: string;
  setDateRange: (value: string) => void;
  format: string;
  setFormat: (value: string) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  reportType,
  setReportType,
  department,
  setDepartment,
  dateRange,
  setDateRange,
  format,
  setFormat,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!reportType || !department || !dateRange || !format) {
      alert('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await generateReport(reportType, department, dateRange, format);
      const filename = `${reportType}-${department}-${dateRange}-${Date.now()}`;
      downloadReport(blob, filename, format);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }}>
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback-summary">Feedback Summary</SelectItem>
                <SelectItem value="department-performance">Department Performance</SelectItem>
                <SelectItem value="response-times">Response Times</SelectItem>
                <SelectItem value="satisfaction-scores">Satisfaction Scores</SelectItem>
                <SelectItem value="trending-issues">Trending Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <DepartmentSelector value={department} onValueChange={setDepartment} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-range">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isGenerating || !reportType || !department || !dateRange || !format}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
