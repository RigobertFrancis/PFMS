
export interface Feedback {
  id: string;
  patientId: string;
  departmentId: string;
  type: 'complaint' | 'suggestion' | 'compliment';
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  requiresAttention: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  totalFeedback: number;
  feedbackByType: {
    complaints: number;
    suggestions: number;
    compliments: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface FeedbackSummary {
  total: number;
  byDepartment: Record<string, number>;
  byType: {
    complaints: number;
    suggestions: number;
    compliments: number;
  };
  requiresAttention: number;
}

export interface ChartData {
  week: number;
  complaints: number;
  suggestions: number;
  compliments: number;
}
