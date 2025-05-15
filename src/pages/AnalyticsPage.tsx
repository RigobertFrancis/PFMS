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
  LineChart,
  Line,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Filter, ChartPie, ChartBar, ChartLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardCard from '@/components/DashboardCard';
import DepartmentSelector from '@/components/DepartmentSelector';
import { departments, feedbackSummary } from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';
import { DateRange } from 'react-day-picker';

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

const chartTypes = [
  { id: 'pie', name: 'Pie Chart', icon: ChartPie },
  { id: 'bar', name: 'Bar Chart', icon: ChartBar },
  { id: 'line', name: 'Line Chart', icon: ChartLine },
];

const categoryOptions = [
  { id: 'all', name: 'All Categories' },
  { id: 'complaints', name: 'Complaints' },
  { id: 'suggestions', name: 'Suggestions' },
  { id: 'compliments', name: 'Compliments' },
];

const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chartType, setChartType] = useState('pie');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const applyFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Department: ${selectedDepartment}, Category: ${selectedCategory}, Chart: ${chartType}${dateRange.from ? `, From: ${format(dateRange.from, 'PP')}` : ''}${dateRange.to ? `, To: ${format(dateRange.to, 'PP')}` : ''}`,
    });
    // In a real implementation, this would fetch filtered data from the backend
  };

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
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
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={selectedDepartment === 'all' ? departmentData : departmentData.filter(d => d.name === departments.find(dept => dept.id === selectedDepartment)?.name)}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedCategory === 'all' || selectedCategory === 'complaints') && 
                <Bar dataKey="complaints" name="Complaints" fill="#ff6b6b" />
              }
              {(selectedCategory === 'all' || selectedCategory === 'suggestions') && 
                <Bar dataKey="suggestions" name="Suggestions" fill="#4dabf7" />
              }
              {(selectedCategory === 'all' || selectedCategory === 'compliments') && 
                <Bar dataKey="compliments" name="Compliments" fill="#40c057" />
              }
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Feedback Count" stroke="#82d0d0" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

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
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Department</label>
              <DepartmentSelector 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "PP")} - {format(dateRange.to, "PP")}
                        </>
                      ) : (
                        format(dateRange.from, "PP")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={new Date()}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map(chart => (
                    <SelectItem key={chart.id} value={chart.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <chart.icon className="h-4 w-4" />
                        {chart.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <Button onClick={applyFilters} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
          
          <div className="h-[500px]">
            {renderChart()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
