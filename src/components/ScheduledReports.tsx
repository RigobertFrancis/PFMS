
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Mail } from 'lucide-react';

const ScheduledReports: React.FC = () => {
  const scheduledReports = [
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
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduledReports.map((report, idx) => (
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
  );
};

export default ScheduledReports;
