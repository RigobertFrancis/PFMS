import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
  Edit
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import StatNumber from '@/components/StatNumber';
import FeedbackTypeChart from '@/components/FeedbackTypeChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDepartmentTranslationKey } from '@/lib/departmentTranslations';
import axios from 'axios';

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
}

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

  const BASE_URL = "http://localhost:8089/api";

  useEffect(() => {
    if (departmentId) {
      loadDepartmentData();
      loadFeedbacks();
      loadChartData();
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

  if (loading) {
    return <div>Loading...</div>;
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
      feedback.id.toString().toLowerCase().includes(search) ||
      (feedback.question && feedback.question.toLowerCase().includes(search)) ||
      (feedback.questionAnswer && feedback.questionAnswer.toLowerCase().includes(search)) ||
      dateStr.includes(search)
    );
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
                <span className="text-3xl font-bold text-green-600">{department.responseRate}%</span>
                <span className="text-sm text-gray-500">{t('response')}: {department.averageResponseTime.toFixed(1)} hours</span>
              </div>
            </DashboardCard>
          </div>
          
          <DashboardCard title="Feedback Trends" className="h-[350px]">
            <FeedbackTypeChart data={chartData} />
          </DashboardCard>
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
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-[100px] font-bold text-gray-700 uppercase">ID</TableHead>
                      <TableHead className="font-bold text-gray-700 uppercase">Type</TableHead>
                      <TableHead className="font-bold text-gray-700 uppercase">Question</TableHead>
                      <TableHead className="font-bold text-gray-700 uppercase">Answer</TableHead>
                      <TableHead className="font-bold text-gray-700 uppercase">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.slice(0, 10).map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="font-medium">{feedback.id}</TableCell>
                        <TableCell>
                          <span className={
                            feedback.category === 'complaint' ? 'bg-feedback-complaint text-white px-2 py-1 rounded-full text-xs font-semibold' :
                            feedback.category === 'suggestion' ? 'bg-feedback-suggestion text-white px-2 py-1 rounded-full text-xs font-semibold' :
                            feedback.category === 'compliment' ? 'bg-feedback-compliment text-white px-2 py-1 rounded-full text-xs font-semibold' :
                            'bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold'
                          }>
                            {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{feedback.question}</TableCell>
                        <TableCell>{feedback.questionAnswer}</TableCell>
                        <TableCell>{(() => {
                          const date = new Date(feedback.createdAt);
                          return isNaN(date.getTime()) ? '-' : date.toISOString().slice(0, 10);
                        })()}</TableCell>
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
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics for the {department.name} department will be shown here.
                This includes feedback trends, response times, and performance metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentPage;
