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
import { number } from 'zod';

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

  const DEPARTMENT_URL = "http://localhost:8089/api/departments";

  // total feedback
  useEffect(() => {
    const fetchCount = async () => {
      const total = await axios.get("http://localhost:8089/api/feedbacks/total");
      setTotalFeedback(total.data);
    };
    fetchCount();
  },[]);

  // require Attention
  useEffect(() => {
    const fetchCount = async () => {
      const total = await axios.get("http://localhost:8089/api/responses/urgent/total");
      setRequireAttention(total.data);
    };
    fetchCount();
  },[]);

  useEffect(()=> {
    loadDepartments();
    fetchChartData();
    fetchFeedbackSummary();
  },[]);

  const loadDepartments = async () =>{
    const result = await axios.get(`${DEPARTMENT_URL}/all`);
    setDepartments(result.data);
  }

  const fetchChartData = async () => {
    const result = await axios.get('http://localhost:8089/api/feedbacks/chart-data');
    setChartData(result.data);
  }

  const fetchFeedbackSummary = async () => {
    // You may need to adjust this endpoint to match your backend for summary by type
    const result = await axios.get('http://localhost:8089/api/feedbacks/summary');
    setFeedbackSummary(result.data);
  }

  // Find the selected department object
  const currentDepartment = departments.find(d => d.id.toString() === selectedDepartment) || departments[0];
  const totalFeedbackPercentage = currentDepartment && totalFeedback ? ((currentDepartment.totalFeedback || 0) / totalFeedback * 100).toFixed(1) : 0;

  return (
    <div className="h-screen flex flex-col p-4 overflow-hidden">
      <div className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0 mb-4">
        <DashboardCard title={t('totalFeedback')} className="h-32">
          <div className="flex flex-col items-center justify-center h-full">
            <StatNumber 
              value={totalFeedback} 
              valueClassName="text-green-600 text-xl" 
            />
            <Badge variant="outline" className="mt-1 text-xs">April 2025</Badge>
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('departmentsTitle')} className="h-32">
          <div className="flex flex-col justify-between h-full">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold">{currentDepartment?.totalFeedback?.toLocaleString() || 0}</span>
              <span className="text-xs text-gray-500">{totalFeedbackPercentage}% of total</span>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('requiresAttention')} className="h-32">
          <div className="flex flex-col items-center justify-center h-full">
            <StatNumber 
              value={requireAttention} 
              valueClassName="text-red-500 text-xl" 
            />
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('response')} className="h-32">
          <div className="flex flex-col justify-center space-y-2 h-full">
            <div className="flex justify-between items-center p-2 bg-gray-100 rounded text-sm">
              <span className="font-medium">2</span>
              <span className="text-xs text-gray-600">{t('response')}</span>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-100 rounded text-sm">
              <span className="font-medium">7+</span>
              <span className="text-xs text-gray-600">{t('notifications')}</span>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <DashboardCard title="" className="h-full flex flex-col">
          <div className="flex justify-between mb-3 flex-shrink-0">
            <div className="flex gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-suggestion rounded-full mr-2"></div>
                <span className="text-sm">{t('suggestions')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-complaint rounded-full mr-2"></div>
                <span className="text-sm">{t('complaints')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-feedback-compliment rounded-full mr-2"></div>
                <span className="text-sm">{t('compliments')}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <FeedbackTypeChart data={chartData} height={250} />
          </div>
        </DashboardCard>
        
        <DashboardCard title={t('feedbackCategories')} className="h-full flex flex-col">
          <div className="space-y-4 flex-1 overflow-y-auto">
            {feedbackSummary ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
                      <span className="font-medium text-sm">{t('complaints')}</span>
                    </div>
                    <span className="font-medium text-sm">{feedbackSummary.byType.complaints.toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    value={feedbackSummary.byType.complaints} 
                    max={feedbackSummary.total} 
                    color="bg-feedback-complaint" 
                    percentage={feedbackSummary.byType.complaints && feedbackSummary.total ? Math.round((feedbackSummary.byType.complaints / feedbackSummary.total) * 100) : 0}
                  />
                  <div className="text-xs text-gray-500">{feedbackSummary.byType.complaints && feedbackSummary.total ? ((feedbackSummary.byType.complaints / feedbackSummary.total) * 100).toFixed(0) : 0}% {t('ofTotal')}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
                      <span className="font-medium text-sm">{t('suggestions')}</span>
                    </div>
                    <span className="font-medium text-sm">{feedbackSummary.byType.suggestions.toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    value={feedbackSummary.byType.suggestions} 
                    max={feedbackSummary.total} 
                    color="bg-feedback-suggestion" 
                    percentage={feedbackSummary.byType.suggestions && feedbackSummary.total ? Math.round((feedbackSummary.byType.suggestions / feedbackSummary.total) * 100) : 0}
                  />
                  <div className="text-xs text-gray-500">{feedbackSummary.byType.suggestions && feedbackSummary.total ? ((feedbackSummary.byType.suggestions / feedbackSummary.total) * 100).toFixed(0) : 0}% {t('ofTotal')}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
                      <span className="font-medium text-sm">{t('compliments')}</span>
                    </div>
                    <span className="font-medium text-sm">{feedbackSummary.byType.compliments.toLocaleString()}</span>
                  </div>
                  <ProgressBar 
                    value={feedbackSummary.byType.compliments} 
                    max={feedbackSummary.total} 
                    color="bg-feedback-compliment" 
                    percentage={feedbackSummary.byType.compliments && feedbackSummary.total ? Math.round((feedbackSummary.byType.compliments / feedbackSummary.total) * 100) : 0}
                  />
                  <div className="text-xs text-gray-500">{feedbackSummary.byType.compliments && feedbackSummary.total ? ((feedbackSummary.byType.compliments / feedbackSummary.total) * 100).toFixed(0) : 0}% {t('ofTotal')}</div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">Loading...</div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
