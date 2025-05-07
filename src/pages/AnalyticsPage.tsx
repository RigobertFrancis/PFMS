
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardCard from '@/components/DashboardCard';
import { departments, feedbackSummary } from '@/lib/mockData';

const pieData = [
  { name: 'Complaints', value: 2187, color: '#ff6b6b' },
  { name: 'Suggestions', value: 3175, color: '#4dabf7' },
  { name: 'Compliments', value: 1693, color: '#40c057' },
];

const departmentData = departments.map(dept => ({
  name: dept.name,
  complaints: dept.feedbackByType.complaints,
  suggestions: dept.feedbackByType.suggestions,
  compliments: dept.feedbackByType.compliments,
}));

const timeData = [
  { name: 'Jan', value: 1245 },
  { name: 'Feb', value: 1583 },
  { name: 'Mar', value: 1420 },
  { name: 'Apr', value: 1876 },
  { name: 'May', value: 1320 },
  { name: 'Jun', value: 980 },
];

const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Total Feedbacks">
          <div className="text-4xl font-bold text-med-blue">{feedbackSummary.total.toLocaleString()}</div>
          <div className="text-sm text-gray-500">All time</div>
        </DashboardCard>
        
        <DashboardCard title="Average Response Time">
          <div className="text-4xl font-bold text-med-blue">6.2 hrs</div>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </DashboardCard>
        
        <DashboardCard title="Satisfaction Score">
          <div className="text-4xl font-bold text-med-blue">4.2/5</div>
          <div className="text-sm text-gray-500">Based on feedback ratings</div>
        </DashboardCard>
      </div>
      
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="distribution">Feedback Distribution</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Type Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Feedback by Department</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="complaints" name="Complaints" fill="#ff6b6b" />
                  <Bar dataKey="suggestions" name="Suggestions" fill="#4dabf7" />
                  <Bar dataKey="compliments" name="Compliments" fill="#40c057" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Feedback Trends</CardTitle>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Feedback Count" fill="#82d0d0" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
