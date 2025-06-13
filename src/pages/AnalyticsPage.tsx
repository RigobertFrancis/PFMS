
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { departments, feedbackSummary, chartData, feedbacks } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [chartType, setChartType] = useState('line');
  const [dateRange, setDateRange] = useState('last-30-days');

  const COLORS = ['#ff6b6b', '#4dabf7', '#40c057'];

  // Filter data based on selected department and date range
  const filteredData = useMemo(() => {
    let filtered = feedbacks;

    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(feedback => feedback.departmentId === selectedDepartment);
    }

    // Filter by date range
    const now = new Date();
    let dateThreshold = new Date();
    
    switch (dateRange) {
      case 'last-7-days':
        dateThreshold.setDate(now.getDate() - 7);
        break;
      case 'last-30-days':
        dateThreshold.setDate(now.getDate() - 30);
        break;
      case 'last-90-days':
        dateThreshold.setDate(now.getDate() - 90);
        break;
      case 'this-year':
        dateThreshold = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        dateThreshold.setDate(now.getDate() - 30);
    }

    filtered = filtered.filter(feedback => new Date(feedback.createdAt) >= dateThreshold);

    return filtered;
  }, [selectedDepartment, dateRange]);

  // Calculate filtered summary
  const filteredSummary = useMemo(() => {
    const complaints = filteredData.filter(f => f.type === 'complaint').length;
    const suggestions = filteredData.filter(f => f.type === 'suggestion').length;
    const compliments = filteredData.filter(f => f.type === 'compliment').length;
    const total = filteredData.length;

    return {
      total,
      byType: {
        complaints,
        suggestions,
        compliments
      }
    };
  }, [filteredData]);

  // Calculate filtered chart data
  const filteredChartData = useMemo(() => {
    // Group filtered data by week
    const weeklyData = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      const weekData = filteredData.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate >= weekStart && feedbackDate < weekEnd;
      });

      const complaints = weekData.filter(f => f.type === 'complaint').length;
      const suggestions = weekData.filter(f => f.type === 'suggestion').length;
      const compliments = weekData.filter(f => f.type === 'compliment').length;

      weeklyData.push({
        week: `Week ${4 - i}`,
        complaints,
        suggestions,
        compliments
      });
    }

    return weeklyData;
  }, [filteredData]);

  const pieData = [
    { name: 'Complaints', value: filteredSummary.byType.complaints, color: '#ff6b6b' },
    { name: 'Suggestions', value: filteredSummary.byType.suggestions, color: '#4dabf7' },
    { name: 'Compliments', value: filteredSummary.byType.compliments, color: '#40c057' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#ff6b6b" name="Complaints" />
              <Bar dataKey="suggestions" fill="#4dabf7" name="Suggestions" />
              <Bar dataKey="compliments" fill="#40c057" name="Compliments" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="complaints" stroke="#ff6b6b" strokeWidth={3} name="Complaints" />
              <Line type="monotone" dataKey="suggestions" stroke="#4dabf7" strokeWidth={3} name="Suggestions" />
              <Line type="monotone" dataKey="compliments" stroke="#40c057" strokeWidth={3} name="Compliments" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('analytics')}</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            <SelectItem value="this-year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            onClick={() => setChartType('line')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Line
          </Button>
          <Button 
            variant={chartType === 'bar' ? 'default' : 'outline'} 
            onClick={() => setChartType('bar')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Bar
          </Button>
          <Button 
            variant={chartType === 'pie' ? 'default' : 'outline'} 
            onClick={() => setChartType('pie')}
            className="flex items-center gap-2"
          >
            <PieChartIcon className="h-4 w-4" />
            Pie
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSummary.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('complaints')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{filteredSummary.byType.complaints}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('suggestions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredSummary.byType.suggestions}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('compliments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filteredSummary.byType.compliments}</div>
            <p className="text-xs text-muted-foreground">Filtered results</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.slice(0, 5).map((dept) => {
                const deptFeedbackCount = selectedDepartment === 'all' 
                  ? dept.totalFeedback 
                  : dept.id === selectedDepartment 
                    ? filteredData.length 
                    : 0;
                const maxCount = selectedDepartment === 'all' ? feedbackSummary.total : filteredSummary.total;
                
                return (
                  <div key={dept.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((deptFeedbackCount / Math.max(maxCount, 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{deptFeedbackCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Response Time</span>
                <span className="text-lg font-bold">4.2 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fastest Response</span>
                <span className="text-sm text-green-600">15 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Response Rate</span>
                <span className="text-sm text-blue-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">New Feedback</span>
                <span className="text-sm text-orange-600">{filteredData.filter(f => f.status === 'new').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
