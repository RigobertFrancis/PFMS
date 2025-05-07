
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Download, Printer, Mail, Calendar } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';

const ReportingPage: React.FC = () => {
  const [reportType, setReportType] = useState('feedback-summary');
  const [department, setDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [format, setFormat] = useState('pdf');
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reporting</h1>
      
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
        
        <DashboardCard title="Report Templates">
          <div className="text-4xl font-bold text-purple-500">6</div>
          <div className="text-sm text-gray-500">Available templates</div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
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
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="outpatient-clinic">Outpatient Clinic</SelectItem>
                    <SelectItem value="inpatient-ward">Inpatient Ward</SelectItem>
                    <SelectItem value="radiology">Radiology</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="mortuary">Mortuary</SelectItem>
                    <SelectItem value="maternity">Maternity</SelectItem>
                    <SelectItem value="immunization">Immunization</SelectItem>
                  </SelectContent>
                </Select>
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
              
              <Button className="w-full">Generate Report</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Monthly Feedback Summary",
                  date: "April 20, 2025",
                  type: "Feedback Summary",
                  format: "PDF"
                },
                {
                  title: "Emergency Department Performance",
                  date: "April 18, 2025",
                  type: "Department Performance",
                  format: "Excel"
                },
                {
                  title: "Response Time Analysis",
                  date: "April 15, 2025",
                  type: "Response Times",
                  format: "PDF"
                },
                {
                  title: "Quarterly Satisfaction Report",
                  date: "April 5, 2025",
                  type: "Satisfaction Scores",
                  format: "PDF"
                },
              ].map((report, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.format}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Printer size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Weekly Feedback Summary",
                schedule: "Every Monday",
                recipients: "management@hospital.com",
                status: "active"
              },
              {
                title: "Monthly Department Performance",
                schedule: "1st of every month",
                recipients: "department-heads@hospital.com",
                status: "active"
              },
              {
                title: "Quarterly Analysis Report",
                schedule: "Every 3 months",
                recipients: "executive-board@hospital.com",
                status: "active"
              },
            ].map((report, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{report.schedule}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Mail size={12} />
                      <span>{report.recipients}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {report.status}
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">
                    Disable
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingPage;
