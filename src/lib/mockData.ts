
import { Feedback, Department, Notification, FeedbackSummary, ChartData } from './types';

export const departments: Department[] = [
  {
    id: 'emergency',
    name: 'Emergency',
    description: 'Emergency department for critical care',
    totalFeedback: 1318,
    feedbackByType: {
      complaints: 422,
      suggestions: 586,
      compliments: 310,
    }
  },
  {
    id: 'outpatient-clinic',
    name: 'Outpatient Clinic',
    description: 'General outpatient services',
    totalFeedback: 1102,
    feedbackByType: {
      complaints: 312,
      suggestions: 506,
      compliments: 284,
    }
  },
  {
    id: 'inpatient-ward',
    name: 'Inpatient Ward',
    description: 'Inpatient care services',
    totalFeedback: 876,
    feedbackByType: {
      complaints: 254,
      suggestions: 398,
      compliments: 224,
    }
  },
  {
    id: 'radiology',
    name: 'Radiology',
    description: 'Diagnostic imaging services',
    totalFeedback: 643,
    feedbackByType: {
      complaints: 187,
      suggestions: 295,
      compliments: 161,
    }
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Clinical laboratory services',
    totalFeedback: 732,
    feedbackByType: {
      complaints: 213,
      suggestions: 336,
      compliments: 183,
    }
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Medication dispensing services',
    totalFeedback: 589,
    feedbackByType: {
      complaints: 171,
      suggestions: 271,
      compliments: 147,
    }
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Payment and insurance services',
    totalFeedback: 954,
    feedbackByType: {
      complaints: 312,
      suggestions: 412,
      compliments: 230,
    }
  },
  {
    id: 'mortuary',
    name: 'Mortuary',
    description: 'Mortuary services',
    totalFeedback: 143,
    feedbackByType: {
      complaints: 32,
      suggestions: 75,
      compliments: 36,
    }
  },
  {
    id: 'maternity',
    name: 'Maternity',
    description: 'Maternal and newborn care services',
    totalFeedback: 456,
    feedbackByType: {
      complaints: 132,
      suggestions: 209,
      compliments: 115,
    }
  },
  {
    id: 'immunization',
    name: 'Immunization',
    description: 'Vaccination services',
    totalFeedback: 243,
    feedbackByType: {
      complaints: 52,
      suggestions: 142,
      compliments: 49,
    }
  },
];

export const feedbacks: Feedback[] = Array(100).fill(null).map((_, index) => {
  const departmentIndex = Math.floor(Math.random() * departments.length);
  const types: Array<'complaint' | 'suggestion' | 'compliment'> = ['complaint', 'suggestion', 'compliment'];
  const typeIndex = Math.floor(Math.random() * types.length);
  const statuses: Array<'new' | 'in-progress' | 'resolved' | 'closed'> = ['new', 'in-progress', 'resolved', 'closed'];
  const statusIndex = Math.floor(Math.random() * statuses.length);
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const priorityIndex = Math.floor(Math.random() * priorities.length);
  const requiresAttention = priorities[priorityIndex] === 'high' || priorities[priorityIndex] === 'urgent';
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

  return {
    id: `feedback-${index + 1}`,
    patientId: `patient-${Math.floor(Math.random() * 1000) + 1}`,
    departmentId: departments[departmentIndex].id,
    type: types[typeIndex],
    title: `Feedback about ${departments[departmentIndex].name}`,
    description: `This is a ${types[typeIndex]} about ${departments[departmentIndex].name}.`,
    status: statuses[statusIndex],
    priority: priorities[priorityIndex],
    createdAt: pastDate.toISOString(),
    updatedAt: today.toISOString(),
    requiresAttention,
  };
});

export const notifications: Notification[] = Array(15).fill(null).map((_, index) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 7));
  const read = Math.random() > 0.7;

  return {
    id: `notification-${index + 1}`,
    title: `New ${Math.random() > 0.5 ? 'urgent' : 'important'} feedback received`,
    message: `A new feedback has been submitted for ${departments[Math.floor(Math.random() * departments.length)].name} department that requires your attention.`,
    read,
    createdAt: pastDate.toISOString(),
  };
});

export const feedbackSummary: FeedbackSummary = {
  total: 7056,
  byDepartment: departments.reduce((acc, dept) => {
    acc[dept.id] = dept.totalFeedback;
    return acc;
  }, {} as Record<string, number>),
  byType: {
    complaints: 2187,
    suggestions: 3175,
    compliments: 1693,
  },
  requiresAttention: 76,
};

export const chartData: ChartData[] = [
  {
    week: 1,
    complaints: 512,
    suggestions: 923,
    compliments: 476,
  },
  {
    week: 2,
    complaints: 842,
    suggestions: 1123,
    compliments: 523,
  },
  {
    week: 3,
    complaints: 919,
    suggestions: 1423,
    compliments: 587,
  },
  {
    week: 4,
    complaints: 1423,
    suggestions: 1523,
    compliments: 456,
  },
];
