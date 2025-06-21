import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardCard from '@/components/DashboardCard';
import StatNumber from '@/components/StatNumber';
import FeedbackTypeChart from '@/components/FeedbackTypeChart';
import ProgressBar from '@/components/ProgressBar';
import GaugeChart from '@/components/GaugeChart';
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';

interface Department {
  id: number,
  name: string,
  totalFeedback?: number
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [requireAttention, setRequireAttention] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);
  const [feedbackSummary, setFeedbackSummary] = useState<any>(null);
  const [currentMonthYear, setCurrentMonthYear] = useState('');
  const [departmentFeedback, setDepartmentFeedback] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const BASE_URL = "http://localhost:8089/api";

  useEffect(() => {
    const updateMonthYear = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('default', {
        month: 'long',
        year: 'numeric'
      });
      setCurrentMonthYear(formattedDate);
    };
    updateMonthYear();
  }, []);

  // Load all data
  useEffect(() => {
    loadAllData();
  }, []);

  // Load department feedback when department changes
  useEffect(() => {
    if (selectedDepartment) {
      loadDepartmentFeedback();
    }
  }, [selectedDepartment]);

  const loadAllData = async () => {
    try {
      const [
        totalFeedbackRes,
        requireAttentionRes,
        departmentsRes,
        chartDataRes,
        feedbackSummaryRes,
        notificationsRes
      ] = await Promise.all([
        axios.get(`${BASE_URL}/feedbacks/total`),
        axios.get(`${BASE_URL}/responses/urgent/total`),
        axios.get(`${BASE_URL}/departments/all`),
        axios.get(`${BASE_URL}/feedbacks/chart-data`),
        axios.get(`${BASE_URL}/feedbacks/summary`),
        axios.get(`${BASE_URL}/notifications`)
      ]);

      setTotalFeedback(totalFeedbackRes.data);
      setRequireAttention(requireAttentionRes.data);
      setDepartments(departmentsRes.data);
      setChartData(chartDataRes.data);
      setFeedbackSummary(feedbackSummaryRes.data);
      
      // Debug chart data
      console.log('Chart data from API:', chartDataRes.data);
      
      // Calculate unread notifications count
      const notifications = notificationsRes.data;
      const unreadCount = notifications.filter((notification: any) => !notification.read).length;
      setUnreadNotifications(unreadCount);

      // Set first department as default
      if (departmentsRes.data.length > 0) {
        setSelectedDepartment(departmentsRes.data[0].id.toString());
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadDepartmentFeedback = async () => {
    if (!selectedDepartment) return;
    
    try {
      const response = await axios.get(`${BASE_URL}/feedbacks/department/total?departmentId=${selectedDepartment}`);
      setDepartmentFeedback(response.data);
    } catch (error) {
      console.error('Error loading department feedback:', error);
      setDepartmentFeedback(0);
    }
  };

  // Calculate department percentage
  const departmentPercentage = totalFeedback > 0 ? ((departmentFeedback / totalFeedback) * 100).toFixed(1) : '0';

  return (
    <div className="h-screen flex flex-col p-6 bg-gray-50">
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('dashboard')}</h1>
        <p className="text-gray-600 mt-1">Welcome to your feedback management dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0 mb-6">
        <DashboardCard title={t('totalFeedback')} className="h-32 bg-white shadow-sm border-0">
          <div className="flex flex-col items-center justify-center h-full">
            <StatNumber 
              value={totalFeedback} 
              valueClassName="text-green-600 text-2xl font-bold" 
            />
            <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
              {currentMonthYear}
            </Badge>
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('departmentsTitle')} className="h-32 bg-white shadow-sm border-0">
          <div className="flex flex-col justify-between h-full">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-9 text-sm bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xl font-bold text-gray-800">{departmentFeedback.toLocaleString()}</span>
              <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-full">
                {departmentPercentage}% of total
              </span>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('requiresAttention')} className="h-32 bg-white shadow-sm border-0">
          <div className="flex flex-col items-center justify-center h-full">
            <StatNumber 
              value={requireAttention} 
              valueClassName="text-red-500 text-2xl font-bold" 
            />
            <p className="text-xs text-gray-500 mt-1">Need immediate response</p>
          </div>
        </DashboardCard>
        
        <DashboardCard title={'Notifications'} className="h-32 bg-white shadow-sm border-0">
          <div className="flex flex-col justify-center space-y-3 h-full">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-semibold text-orange-700">
                {unreadNotifications > 0 ? unreadNotifications : 0}
              </span>
              <span className="text-xs text-orange-600">{t('notifications')}</span>
            </div>
            {/* <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-700">2</span>
              <span className="text-xs text-blue-600">{t('response')}</span>
            </div> */}
            
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <DashboardCard title="Feedback Trends" className="h-full flex flex-col bg-white shadow-sm border-0">
          <div className="flex justify-between mb-4 flex-shrink-0">
            <div className="flex gap-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-suggestion rounded-full mr-2"></div>
                <span className="text-sm font-medium">{t('suggestions')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-complaint rounded-full mr-2"></div>
                <span className="text-sm font-medium">{t('complaints')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-compliment rounded-full mr-2"></div>
                <span className="text-sm font-medium">{t('compliments')}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <FeedbackTypeChart data={chartData} height={250} />
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('feedbackCategories')} className="h-full flex flex-col bg-white shadow-sm border-0">
          <div className="space-y-6 flex-1 overflow-y-auto p-2">
            {feedbackSummary ? (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-400 rounded-full mr-3"></div>
                      <span className="font-medium text-sm">{t('complaints')}</span>
                    </div>
                    <span className="font-bold text-sm">{feedbackSummary.byType.complaints.toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    value={feedbackSummary.byType.complaints} 
                    max={feedbackSummary.total} 
                    color="bg-feedback-complaint" 
                    percentage={feedbackSummary.byType.complaints && feedbackSummary.total ? Math.round((feedbackSummary.byType.complaints / feedbackSummary.total) * 100) : 0}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {feedbackSummary.byType.complaints && feedbackSummary.total ? ((feedbackSummary.byType.complaints / feedbackSummary.total) * 100).toFixed(1) : 0}% {t('ofTotal')}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-400 rounded-full mr-3"></div>
                      <span className="font-medium text-sm">{t('suggestions')}</span>
                    </div>
                    <span className="font-bold text-sm">{feedbackSummary.byType.suggestions.toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    value={feedbackSummary.byType.suggestions} 
                    max={feedbackSummary.total} 
                    color="bg-feedback-suggestion" 
                    percentage={feedbackSummary.byType.suggestions && feedbackSummary.total ? Math.round((feedbackSummary.byType.suggestions / feedbackSummary.total) * 100) : 0}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {feedbackSummary.byType.suggestions && feedbackSummary.total ? ((feedbackSummary.byType.suggestions / feedbackSummary.total) * 100).toFixed(1) : 0}% {t('ofTotal')}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-400 rounded-full mr-3"></div>
                      <span className="font-medium text-sm">{t('compliments')}</span>
                    </div>
                    <span className="font-bold text-sm">{feedbackSummary.byType.compliments.toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    value={feedbackSummary.byType.compliments} 
                    max={feedbackSummary.total} 
                    color="bg-feedback-compliment" 
                    percentage={feedbackSummary.byType.compliments && feedbackSummary.total ? Math.round((feedbackSummary.byType.compliments / feedbackSummary.total) * 100) : 0}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {feedbackSummary.byType.compliments && feedbackSummary.total ? ((feedbackSummary.byType.compliments / feedbackSummary.total) * 100).toFixed(1) : 0}% {t('ofTotal')}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">Loading feedback summary...</div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
