import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  Edit,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format, addDays, differenceInCalendarDays, startOfWeek, endOfWeek } from 'date-fns';
import DashboardCard from '@/components/DashboardCard';
import StatNumber from '@/components/StatNumber';
import FeedbackTypeChart from '@/components/FeedbackTypeChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDepartmentTranslationKey } from '@/lib/departmentTranslations';
import axios from 'axios';
import SentimentPieChart from '@/components/SentimentPieChart';
import FeedbackTypeBarChart from '@/components/FeedbackTypeBarChart';
import { clusterUserFeedback, UserFeedbackCluster } from '@/utils/feedbackCategorizer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Department {
  id: number;
  name: string;
  description: string;
  totalFeedback: number;
  feedbackByType: {
    complaints: number;
    suggestions: number;
    compliments: number;
  };
  responseRate: number;
  averageResponseTime: number;
  questions?: Question[];
  priority: string;
}

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  required: boolean;
  options?: string[];
}

interface Feedback {
  id: string;
  category: string;
  question: string;
  questionAnswer: string;
  createdAt: string;
  departmentId: number;
  patientId: number;
}

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
  'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const COLORS = ['#ff6b6b', '#4dabf7', '#40c057'];

const DepartmentPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { t } = useLanguage();
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Analytics states
  const [chartType, setChartType] = useState('line');
  const [timeFilterType, setTimeFilterType] = useState<'year' | 'month' | 'range'>('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedRange, setSelectedRange] = useState<{ from: Date; to?: Date } | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<'all' | 'complaint' | 'suggestion' | 'compliment'>('all');
  const [isRangePopoverOpen, setIsRangePopoverOpen] = useState(false);
  const [feedbackSummary, setFeedbackSummary] = useState<any>(null);
  const [analyticsChartData, setAnalyticsChartData] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<UserFeedbackCluster | null>(null);
  const [clusterCategoryFilter, setClusterCategoryFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [clusterPatientIdFilter, setClusterPatientIdFilter] = useState('');

  const BASE_URL = "http://localhost:8089/api";

    // Dummy data for charts and clusters (replace with real data as needed)
    const sentimentData = { positive: 13, negative: 13, neutral: 0 };
    const feedbackTypeData = { compliments: 13, suggestions: 0, complaints: 13 };
    const patientClusters = [
      { id: 'Patient-152', category: 'Neutral', lastFeedback: '6/19/2025' },
      { id: 'Patient-103', category: 'Negative', lastFeedback: '6/18/2025' },
      { id: 'Patient-64', category: 'Neutral', lastFeedback: '6/18/2025' },
      { id: 'Patient-61', category: 'Negative', lastFeedback: '6/18/2025' },
    ];

  useEffect(() => {
    if (departmentId) {
      loadDepartmentData();
      loadFeedbacks();
      loadChartData();
      loadAnalyticsData();
    }
  }, [departmentId]);

  const loadDepartmentData = async () => {
    if (!departmentId) return;
    
    try {
      const [
        departmentResponse,
        totalFeedbackResponse,
        complaintFeedbackResponse,
        complimentFeedbackResponse,
        suggestionFeedbackResponse,
        questionsResponse
      ] = await Promise.all([
        axios.get(`${BASE_URL}/departments/department/${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/complaints/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/compliments/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/suggestion/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/questions/department?departmentId=${departmentId}`)
      ]);

      const totalFeedback = Number(totalFeedbackResponse.data);
      const totalDepartmentFeedback = Number(departmentResponse.data.totalFeedback) || 0;
      const responseRate = totalDepartmentFeedback > 0 
        ? ((totalDepartmentFeedback / totalFeedback) * 100).toFixed(1) 
        : '0';

      setDepartment({
        ...departmentResponse.data,
        totalFeedback: totalFeedbackResponse.data,
        feedbackByType: {
          complaints: complaintFeedbackResponse.data,
          compliments: complimentFeedbackResponse.data,
          suggestions: suggestionFeedbackResponse.data
        },
        responseRate: parseFloat(responseRate),
        averageResponseTime: totalFeedback > 0 ? (totalDepartmentFeedback / totalFeedback) : 0,
        questions: questionsResponse.data
      });
    } catch (err) {
      console.error('Error loading department data:', err);
      setError('Failed to load department data');
    }
  };

  const loadFeedbacks = async () => {
    if (!departmentId) return;
    
    try {
      const response = await axios.get(`${BASE_URL}/feedbacks/all`);
      setFeedbacks(response.data.filter((f: Feedback) => f.departmentId.toString() === departmentId));
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setError('Failed to load feedbacks');
    }
  };

  const loadChartData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/feedbacks/chart-data`);
      setChartData(response.data);
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    if (!departmentId || !feedbacks.length) return;
    
    try {
      // Use the existing working endpoints for summary data
      const [
        totalFeedbackResponse,
        complaintFeedbackResponse,
        complimentFeedbackResponse,
        suggestionFeedbackResponse
      ] = await Promise.all([
        axios.get(`${BASE_URL}/feedbacks/department/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/complaints/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/compliments/total?departmentId=${departmentId}`),
        axios.get(`${BASE_URL}/feedbacks/department/suggestion/total?departmentId=${departmentId}`)
      ]);

      // Filter feedbacks for this department (use existing feedbacks data)
      const departmentFeedbacks = feedbacks.filter((f: Feedback) => f.departmentId.toString() === departmentId);

      // Create summary data
      const summary = {
        total: Number(totalFeedbackResponse.data),
        byType: {
          complaints: Number(complaintFeedbackResponse.data),
          suggestions: Number(suggestionFeedbackResponse.data),
          compliments: Number(complimentFeedbackResponse.data)
        }
      };

      // Create chart data based on time filters
      let chartData = [];
      
      if (timeFilterType === 'year') {
        // Group by months for the selected year
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const monthFeedbacks = departmentFeedbacks.filter((f: Feedback) => {
            const date = new Date(f.createdAt);
            return date.getFullYear() === selectedYear && date.getMonth() === i;
          });
          
          return {
            period: MONTHS[i],
            complaints: monthFeedbacks.filter((f: Feedback) => f.category === 'COMPLAINT').length,
            suggestions: monthFeedbacks.filter((f: Feedback) => f.category === 'SUGGESTION').length,
            compliments: monthFeedbacks.filter((f: Feedback) => f.category === 'COMPLIMENT').length
          };
        });
        chartData = monthlyData;
      } else if (timeFilterType === 'month') {
        // Group by weeks for the selected month
        const weeklyData = Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(selectedYear, selectedMonth, i * 7 + 1);
          const weekEnd = new Date(selectedYear, selectedMonth, (i + 1) * 7);
          
          const weekFeedbacks = departmentFeedbacks.filter((f: Feedback) => {
            const date = new Date(f.createdAt);
            return date >= weekStart && date <= weekEnd;
          });
          
          return {
            period: `Week ${i + 1}`,
            complaints: weekFeedbacks.filter((f: Feedback) => f.category === 'COMPLAINT').length,
            suggestions: weekFeedbacks.filter((f: Feedback) => f.category === 'SUGGESTION').length,
            compliments: weekFeedbacks.filter((f: Feedback) => f.category === 'COMPLIMENT').length
          };
        });
        chartData = weeklyData;
      } else if (timeFilterType === 'range' && isDateRangeValid(selectedRange)) {
        // Group by days for the selected range
        const startDate = selectedRange!.from;
        const endDate = selectedRange!.to!;
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const dailyData = Array.from({ length: daysDiff + 1 }, (_, i) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          const dayFeedbacks = departmentFeedbacks.filter((f: Feedback) => {
            const date = new Date(f.createdAt);
            return date.toDateString() === currentDate.toDateString();
          });
          
          return {
            period: format(currentDate, 'MMM dd'),
            complaints: dayFeedbacks.filter((f: Feedback) => f.category === 'COMPLAINT').length,
            suggestions: dayFeedbacks.filter((f: Feedback) => f.category === 'SUGGESTION').length,
            compliments: dayFeedbacks.filter((f: Feedback) => f.category === 'COMPLIMENT').length
          };
        });
        chartData = dailyData;
      } else {
        // Default: show last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const dayFeedbacks = departmentFeedbacks.filter((f: Feedback) => {
            const feedbackDate = new Date(f.createdAt);
            return feedbackDate.toDateString() === date.toDateString();
          });
          
          return {
            period: format(date, 'MMM dd'),
            complaints: dayFeedbacks.filter((f: Feedback) => f.category === 'COMPLAINT').length,
            suggestions: dayFeedbacks.filter((f: Feedback) => f.category === 'SUGGESTION').length,
            compliments: dayFeedbacks.filter((f: Feedback) => f.category === 'COMPLIMENT').length
          };
        }).reverse();
        chartData = last7Days;
      }

      // Filter by selected type if not 'all'
      if (selectedType !== 'all') {
        const typeKey = selectedType === 'complaint' ? 'complaints' : 
                       selectedType === 'suggestion' ? 'suggestions' : 'compliments';
        chartData = chartData.map(item => ({
          period: item.period,
          [typeKey]: item[typeKey]
        }));
      }

      setFeedbackSummary(summary);
      setAnalyticsChartData(chartData);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data');
    }
  };

  // Refetch analytics data when filters change
  useEffect(() => {
    if (departmentId && !loading && feedbacks.length > 0) {
      loadAnalyticsData();
    }
  }, [timeFilterType, selectedYear, selectedMonth, selectedRange, selectedType, departmentId, loading, feedbacks]);

  // Helper function to validate date range
  const isDateRangeValid = (range: { from: Date; to?: Date } | undefined) => {
    if (!range?.from || !range?.to) return false;
    return range.from <= range.to;
  };

  // Calculate filtered summary
  const filteredSummary = useMemo(() => {
    if (!feedbackSummary) {
      return {
        total: 0,
        byType: {
          complaints: 0,
          suggestions: 0,
          compliments: 0
        }
      };
    }

    return {
      total: feedbackSummary.total,
      byType: feedbackSummary.byType
    };
  }, [feedbackSummary]);

  // Calculate response time analysis
  const responseTimeAnalysis = useMemo(() => {
    if (!feedbacks.length) {
      return {
        averageResponseTime: 'N/A',
        fastestResponse: 'N/A',
        responseRate: '0%',
        totalFeedback: 0
      };
    }
    
    // Calculate response times based on feedback creation dates
    const now = new Date();
    const responseTimes = feedbacks.map(feedback => {
      const createdAt = new Date(feedback.createdAt);
      const diffInMs = now.getTime() - createdAt.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      return diffInHours;
    });
    
    const totalFeedback = feedbacks.length;
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / totalFeedback;
    const fastestResponse = Math.min(...responseTimes);
    
    // Format response times
    const formatResponseTime = (hours: number) => {
      if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} minutes`;
      } else if (hours < 24) {
        return `${hours.toFixed(1)} hours`;
      } else {
        const days = Math.round(hours / 24);
        return `${days} days`;
      }
    };
    
    return {
      averageResponseTime: formatResponseTime(averageResponseTime),
      fastestResponse: formatResponseTime(fastestResponse),
      responseRate: '94%',
      totalFeedback
    };
  }, [feedbacks]);

  const pieData = [
    { name: 'Complaints', value: filteredSummary.byType.complaints, color: '#ff6b6b' },
    { name: 'Suggestions', value: filteredSummary.byType.suggestions, color: '#4dabf7' },
    { name: 'Compliments', value: filteredSummary.byType.compliments, color: '#40c057' }
  ];

  const renderChart = () => {
    // Don't render chart if range is selected but invalid
    if (timeFilterType === 'range' && !isDateRangeValid(selectedRange)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Please select a valid date range</div>
        </div>
      );
    }

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsChartData}>
              <CartesianGrid />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedType === 'all' ? (
                <>
              <Bar dataKey="complaints" fill="#ff6b6b" name="Complaints" />
              <Bar dataKey="suggestions" fill="#4dabf7" name="Suggestions" />
              <Bar dataKey="compliments" fill="#40c057" name="Compliments" />
                </>
              ) : selectedType === 'complaint' ? (
                <Bar dataKey="complaints" fill="#ff6b6b" name="Complaints" />
              ) : selectedType === 'suggestion' ? (
                <Bar dataKey="suggestions" fill="#4dabf7" name="Suggestions" />
              ) : (
                <Bar dataKey="compliments" fill="#40c057" name="Compliments" />
              )}
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
            <LineChart data={analyticsChartData}>
              <CartesianGrid />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedType === 'all' ? (
                <>
              <Line type="monotone" dataKey="complaints" stroke="#ff6b6b" strokeWidth={3} name="Complaints" />
              <Line type="monotone" dataKey="suggestions" stroke="#4dabf7" strokeWidth={3} name="Suggestions" />
              <Line type="monotone" dataKey="compliments" stroke="#40c057" strokeWidth={3} name="Compliments" />
                </>
              ) : selectedType === 'complaint' ? (
                <Line type="monotone" dataKey="complaints" stroke="#ff6b6b" strokeWidth={3} name="Complaints" />
              ) : selectedType === 'suggestion' ? (
                <Line type="monotone" dataKey="suggestions" stroke="#4dabf7" strokeWidth={3} name="Suggestions" />
              ) : (
                <Line type="monotone" dataKey="compliments" stroke="#40c057" strokeWidth={3} name="Compliments" />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  function getSelectedTimeLabel() {
    if (timeFilterType === 'year') return selectedYear.toString();
    if (timeFilterType === 'month') return `${MONTHS[selectedMonth]} ${selectedYear}`;
    if (timeFilterType === 'range' && selectedRange && selectedRange.from && selectedRange.to) {
      return `${format(selectedRange.from, 'PPP')} - ${format(selectedRange.to, 'PPP')}`;
    }
    if (timeFilterType === 'range' && selectedRange?.from && !selectedRange?.to) {
      return `${format(selectedRange.from, 'PPP')} - Select end date`;
    }
    if (timeFilterType === 'range') {
      return 'Select date range';
    }
    return '';
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Format as 'June 06, 2025'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
  };

  const clusters = useMemo(() => clusterUserFeedback(feedbacks), [feedbacks]);
  const filteredClusters = useMemo(() => {
    return clusters.filter(cluster => {
      const categoryMatch = clusterCategoryFilter === 'all' || cluster.overallCategory.overall === clusterCategoryFilter;
      const patientIdMatch = clusterPatientIdFilter === '' || String(cluster.patientId).includes(clusterPatientIdFilter);
      return categoryMatch && patientIdMatch;
    });
  }, [clusters, clusterCategoryFilter, clusterPatientIdFilter]);

  // For analytics: count feedbacks by category
  const analyticsCategoryData = useMemo(() => {
    const counts = { COMPLAINT: 0, SUGGESTION: 0, COMPLIMENT: 0 };
    feedbacks.forEach(fb => {
      if (fb.category === 'COMPLAINT') counts.COMPLAINT++;
      else if (fb.category === 'SUGGESTION') counts.SUGGESTION++;
      else if (fb.category === 'COMPLIMENT') counts.COMPLIMENT++;
    });
    return [
      { category: 'Complaint', count: counts.COMPLAINT },
      { category: 'Suggestion', count: counts.SUGGESTION },
      { category: 'Compliment', count: counts.COMPLIMENT },
    ];
  }, [feedbacks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we load the department data</p>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-4">{error || 'Department not found'}</p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Apply search and type filter
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Type/category filter (normalize to lowercase for robust matching)
    if (filterType !== 'all' && feedback.category && feedback.category.toLowerCase() !== filterType) return false;
    if (!searchValue) return true;
    const dateObj = new Date(feedback.createdAt);
    const dateStr = isNaN(dateObj.getTime()) ? '-' : dateObj.toISOString().slice(0, 10);
    const search = searchValue.toLowerCase();
    return (
      feedback.patientId.toString().toLowerCase().includes(search) ||
      (feedback.question && feedback.question.toLowerCase().includes(search)) ||
      (feedback.questionAnswer && feedback.questionAnswer.toLowerCase().includes(search)) ||
      dateStr.includes(search)
    );
  }).sort((a, b) => {
    // Sort by createdAt in descending order (most recent first)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const handleEditFeedbackForm = () => {
    navigate(`/departments/${departmentId}/feedback-form`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{department.name} Department</h1><br/>
        </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="feedbacks">{t('feedbacks')}</TabsTrigger>
          <TabsTrigger value="feedbackForm">{t('feedbackForm')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analyticsTab')}</TabsTrigger>
          <TabsTrigger value="clusters">Feedback Clusters</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <DashboardCard title={t('totalFeedback')}>
              <StatNumber 
                value={department.totalFeedback.toLocaleString()} 
                valueClassName="text-med-blue" 
                label={t('totalFeedbacks')}
              />
            </DashboardCard>
            
            <DashboardCard title={t('feedbackCategories')}>
              <div className="flex justify-between space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-feedback-complaint rounded-full mb-1"></div>
                  <span className="text-xl font-bold">{department.feedbackByType.complaints}</span>
                  <span className="text-xs text-gray-500">{t('complaints')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-feedback-suggestion rounded-full mb-1"></div>
                  <span className="text-xl font-bold">{department.feedbackByType.suggestions}</span>
                  <span className="text-xs text-gray-500">{t('suggestions')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-feedback-compliment rounded-full mb-1"></div>
                  <span className="text-xl font-bold">{department.feedbackByType.compliments}</span>
                  <span className="text-xs text-gray-500">{t('compliments')}</span>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard title={t('responseRate')}>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-green-600">{responseTimeAnalysis.responseRate}</span>
                <span className="text-sm text-gray-500">{t('response')}: {responseTimeAnalysis.averageResponseTime}</span>
              </div>
            </DashboardCard>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Department Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">Description</h3>
                    <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-md">
                      {department.description || 'No description available for this department.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">Priority Level</h3>
                    <Badge variant={
                      department.priority === 'HIGH' ? 'destructive' :
                      department.priority === 'MEDIUM' ? 'default' : 'secondary'
                    } className="text-sm px-3 py-1">
                      {department.priority || 'MEDIUM'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">Department ID</h3>
                    <p className="text-sm text-gray-800 font-mono bg-gray-50 p-3 rounded-md">#{department.id}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-2 uppercase tracking-wide">Total Staff</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">24</span>
                      </div>
                      <span className="text-sm text-gray-800">members</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Overview Section */}
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-4 uppercase tracking-wide">Staff Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">8</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Doctors</h4>
                        <p className="text-xs text-blue-600">Medical professionals</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">12</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Nurses</h4>
                        <p className="text-xs text-green-600">Patient care staff</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Support Staff</h4>
                        <p className="text-xs text-purple-600">Administrative staff</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Details Section */}
              <div>
                <h3 className="font-semibold text-sm text-gray-600 mb-4 uppercase tracking-wide">Staff Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Doctors */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-800">Doctors (8)</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">Dr. Sarah Johnson</span>
                        <Badge variant="outline" className="text-xs bg-blue-100">Head Doctor</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">Dr. Michael Chen</span>
                        <Badge variant="outline" className="text-xs bg-blue-100">Senior</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">Dr. Emily Rodriguez</span>
                        <Badge variant="outline" className="text-xs bg-blue-100">Specialist</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">Dr. David Thompson</span>
                        <Badge variant="outline" className="text-xs bg-blue-100">Resident</Badge>
                      </div>
                      <div className="text-xs text-gray-500 text-center py-1">+4 more doctors</div>
                    </div>
                  </div>

                  {/* Nurses */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-800">Nurses (12)</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">Nurse Maria Garcia</span>
                        <Badge variant="outline" className="text-xs bg-green-100">Head Nurse</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">Nurse James Wilson</span>
                        <Badge variant="outline" className="text-xs bg-green-100">Senior</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">Nurse Lisa Park</span>
                        <Badge variant="outline" className="text-xs bg-green-100">Specialist</Badge>
                      </div>
                      <div className="text-xs text-gray-500 text-center py-1">+9 more nurses</div>
                    </div>
                  </div>

                  {/* Support Staff */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-800">Support Staff (4)</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                        <span className="text-sm font-medium">John Smith</span>
                        <Badge variant="outline" className="text-xs bg-purple-100">Administrator</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                        <span className="text-sm font-medium">Anna Davis</span>
                        <Badge variant="outline" className="text-xs bg-purple-100">Receptionist</Badge>
                      </div>
                      <div className="text-xs text-gray-500 text-center py-1">+2 more staff</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedbacks">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder={t('searchFeedbacks')}
                    className="pl-8"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="compliment">Compliment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-med-blue hover:bg-med-blue/80">
                      <TableHead className="w-[120px] font-bold text-gray-700 ">Patient</TableHead>
                      <TableHead className="font-bold text-gray-700 uppercase">Type</TableHead>
                      <TableHead className="font-bold text-gray-700 uppercase">Question</TableHead>
                      <TableHead className="w-[150px] font-bold text-gray-700 uppercase">Answer</TableHead>
                      <TableHead className="w-[150px] font-bold text-gray-700 uppercase">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.slice(0, 10).map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="font-medium">patient-{feedback.patientId}</TableCell>
                        <TableCell>
                          <span className={
                            feedback.category === 'COMPLAINT' ? 'px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border-red-200' :
                            feedback.category === 'SUGGESTION' ? 'px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200' :
                            feedback.category === 'COMPLIMENT' ? 'px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border-green-200' :
                            'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
                          }>
                            {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{feedback.question}</TableCell>
                        <TableCell>{feedback.questionAnswer}</TableCell>
                        <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">{filteredFeedbacks.length}</span> results
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedbackForm">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Feedback Form Questions</CardTitle>
              <Button onClick={() => navigate(`/departmentQuestions/${departmentId}`)} className="flex items-center gap-2">
                <Edit size={16} />
                Edit Questions
              </Button>
            </CardHeader>
            <CardContent>
              {department.questions && department.questions.length > 0 ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground mb-4">
                    These questions will be displayed to patients when they submit feedback for this department.
                  </p>
                  <div className="border rounded-md p-4 space-y-4">
                    {department.questions.map((question, index) => (
                      <div key={question.id || index} className="pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{index + 1}. {question.questionText}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{question.questionType}</Badge>
                              {question.required && <Badge>Required</Badge>}
                            </div>
                          </div>
                        </div>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2 pl-4">
                            <p className="text-sm text-gray-500 mb-1">Options:</p>
                            <ul className="list-disc pl-5 text-sm">
                              {question.options.map((option, i) => (
                                <li key={option + '-' + i}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No custom questions have been created for this department yet.
                  </p>
                  <Button onClick={() => navigate(`/departmentQuestions/${departmentId}`)}>Create Questions</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="space-y-6">
          
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <Select value={timeFilterType} onValueChange={v => setTimeFilterType(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="range">Range</SelectItem>
                </SelectContent>
              </Select>
              {timeFilterType === 'year' && (
                <Select value={selectedYear.toString()} onValueChange={v => setSelectedYear(Number(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {timeFilterType === 'month' && (
                <> <Select value={selectedMonth.toString()} onValueChange={v => setSelectedMonth(Number(v))}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={m} value={i.toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
                  <Select value={selectedYear.toString()} onValueChange={v => setSelectedYear(Number(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 
                </>
              )}
              {timeFilterType === 'range' && (
                <Popover open={isRangePopoverOpen} onOpenChange={setIsRangePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-64 justify-start">
                      {selectedRange && selectedRange.from && selectedRange.to
                        ? `${format(selectedRange.from, 'PPP')} - ${format(selectedRange.to, 'PPP')}`
                        : selectedRange?.from && !selectedRange?.to
                        ? `${format(selectedRange.from, 'PPP')} - Select end date`
                        : 'Pick a date range'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <div className="flex flex-col gap-2 p-2">
                      <Calendar
                        mode="range"
                        selected={selectedRange}
                        onSelect={(range) => {
                          setSelectedRange(range);
                        }}
                        initialFocus
                        disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setSelectedRange(undefined);
                            setIsRangePopoverOpen(false);
                          }}
                          className="flex-1"
                        >
                          Clear Selection
                        </Button>
                        {selectedRange?.from && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsRangePopoverOpen(false)}
                            className="flex-1"
                          >
                            {selectedRange?.to ? 'Done' : 'Close'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <Select value={selectedType} onValueChange={v => setSelectedType(v as any)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="complaint">Complaints</SelectItem>
                  <SelectItem value="suggestion">Suggestions</SelectItem>
                  <SelectItem value="compliment">Compliments</SelectItem>
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
                 
                {selectedType === 'all' && (
                <Button 
                  variant={chartType === 'pie' ? 'default' : 'outline'} 
                  onClick={() => setChartType('pie')}
                  className="flex items-center gap-2"
                >
                  <PieChartIcon className="h-4 w-4" />
                  Pie
                </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredSummary.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{getSelectedTimeLabel()}</p>
                </CardContent>
              </Card>

              {(selectedType === 'all' || selectedType === 'complaint') && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t('complaints')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{filteredSummary.byType.complaints}</div>
                    <p className="text-xs text-muted-foreground">{getSelectedTimeLabel()}</p>
                  </CardContent>
                </Card>
              )}

              {(selectedType === 'all' || selectedType === 'suggestion') && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t('suggestions')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{filteredSummary.byType.suggestions}</div>
                    <p className="text-xs text-muted-foreground">{getSelectedTimeLabel()}</p>
                  </CardContent>
                </Card>
              )}

              {(selectedType === 'all' || selectedType === 'compliment') && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{t('compliments')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{filteredSummary.byType.compliments}</div>
                    <p className="text-xs text-muted-foreground">{getSelectedTimeLabel()}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart()}
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
                    <span className="text-lg font-bold">{responseTimeAnalysis.averageResponseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fastest Response</span>
                    <span className="text-sm text-green-600">{responseTimeAnalysis.fastestResponse}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Response Rate</span>
                    <span className="text-sm text-blue-600">{responseTimeAnalysis.responseRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Feedback</span>
                    <span className="text-sm text-orange-600">{responseTimeAnalysis.totalFeedback}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="clusters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback Analysis</CardTitle>
              <CardDescription>Clustered feedback by patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    className="border rounded px-2 py-1"
                    value={clusterCategoryFilter}
                    onChange={e => setClusterCategoryFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Patient ID</label>
                  <input
                    className="border rounded px-2 py-1"
                    type="text"
                    placeholder="Search patient ID..."
                    value={clusterPatientIdFilter}
                    onChange={e => setClusterPatientIdFilter(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Feedback</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClusters.map((cluster) => (
                      <tr key={cluster.patientId}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">patient-{cluster.patientId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cluster.overallCategory.overall === 'negative' ? 'bg-red-100 text-red-700' : cluster.overallCategory.overall === 'neutral' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{cluster.overallCategory.overall.charAt(0).toUpperCase() + cluster.overallCategory.overall.slice(1)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{cluster.lastFeedbackDate ? new Date(cluster.lastFeedbackDate).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm" variant="outline" onClick={() => setSelectedCluster(cluster)}>View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Dialog open={!!selectedCluster} onOpenChange={() => setSelectedCluster(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Feedback Details for Patient-{selectedCluster?.patientId}</DialogTitle>
                <DialogDescription>All questions and answers submitted by this patient.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedCluster?.feedbacks.map((fb) => (
                  <div key={fb.id} className="border-b pb-2 mb-2">
                    <div className="font-semibold">Q: {fb.question}</div>
                    <div className="ml-2">A: {fb.questionAnswer}</div>
                    <div className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentPage;
