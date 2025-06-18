
import { Feedback, Department, Notification, FeedbackSummary, ChartData, Question, VisitorFeedback, Visitor } from './types';

// Sample questions for departments
const commonQuestions: Question[] = [
  {
    id: 'q1',
    text: 'How would you rate the cleanliness of this department?',
    type: 'rating',
    required: true,
  },
  {
    id: 'q2',
    text: 'How satisfied were you with the staff in this department?',
    type: 'rating',
    required: true,
  },
  {
    id: 'q3',
    text: 'Did the staff explain everything clearly?',
    type: 'radio',
    required: true,
    options: ['Yes, perfectly', 'Yes, somewhat', 'No, not at all']
  },
];

export const departments: Department[] = [
  {
    id: 'emergency',
    name: 'Emergency',
    description: 'Emergency department for critical care',
    priority: 'critical',
    totalFeedback: 1318,
    feedbackByType: {
      complaints: 422,
      suggestions: 586,
      compliments: 310,
    },
    questions: [
      ...commonQuestions,
      {
        id: 'em-q1',
        text: 'How long did you wait before being attended to?',
        type: 'select',
        required: true,
        options: ['Less than 15 minutes', '15-30 minutes', '30-60 minutes', 'More than 60 minutes']
      },
      {
        id: 'em-q2',
        text: 'Was your emergency handled efficiently?',
        type: 'radio',
        required: true,
        options: ['Yes, very efficiently', 'Somewhat efficiently', 'Not very efficiently', 'Not at all efficiently']
      }
    ]
  },
  {
    id: 'outpatient-clinic',
    name: 'Outpatient Clinic',
    description: 'General outpatient services',
    priority: 'high',
    totalFeedback: 1102,
    feedbackByType: {
      complaints: 312,
      suggestions: 506,
      compliments: 284,
    },
    questions: [
      ...commonQuestions,
      {
        id: 'op-q1',
        text: 'Were you satisfied with your appointment time?',
        type: 'radio',
        required: false,
        options: ['Yes', 'No', 'Somewhat']
      }
    ]
  },
  {
    id: 'inpatient-ward',
    name: 'Inpatient Ward',
    description: 'Inpatient care services',
    priority: 'high',
    totalFeedback: 876,
    feedbackByType: {
      complaints: 254,
      suggestions: 398,
      compliments: 224,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'radiology',
    name: 'Radiology',
    description: 'Diagnostic imaging services',
    priority: 'medium',
    totalFeedback: 643,
    feedbackByType: {
      complaints: 187,
      suggestions: 295,
      compliments: 161,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Clinical laboratory services',
    priority: 'medium',
    totalFeedback: 732,
    feedbackByType: {
      complaints: 213,
      suggestions: 336,
      compliments: 183,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Medication dispensing services',
    priority: 'medium',
    totalFeedback: 589,
    feedbackByType: {
      complaints: 171,
      suggestions: 271,
      compliments: 147,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Payment and insurance services',
    priority: 'low',
    totalFeedback: 954,
    feedbackByType: {
      complaints: 312,
      suggestions: 412,
      compliments: 230,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'mortuary',
    name: 'Mortuary',
    description: 'Mortuary services',
    priority: 'medium',
    totalFeedback: 143,
    feedbackByType: {
      complaints: 32,
      suggestions: 75,
      compliments: 36,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'maternity',
    name: 'Maternity',
    description: 'Maternal and newborn care services',
    priority: 'high',
    totalFeedback: 456,
    feedbackByType: {
      complaints: 132,
      suggestions: 209,
      compliments: 115,
    },
    questions: [...commonQuestions]
  },
  {
    id: 'immunization',
    name: 'Immunization',
    description: 'Vaccination services',
    priority: 'medium',
    totalFeedback: 243,
    feedbackByType: {
      complaints: 52,
      suggestions: 142,
      compliments: 49,
    },
    questions: [...commonQuestions]
  },
];

// Add questions to the remaining departments
departments.forEach((dept, index) => {
  if (!dept.questions || dept.questions.length === 0) {
    dept.questions = [...commonQuestions];
    
    // Add department-specific questions
    if (dept.id === 'pharmacy') {
      dept.questions.push({
        id: `${dept.id}-q1`,
        questionText: 'How long did you wait to receive your medication?',
        ype: 'select',
        required: false,
        options: ['Less than 10 minutes', '10-20 minutes', '20-30 minutes', 'More than 30 minutes']
      });
    } else if (dept.id === 'radiology') {
      dept.questions.push({
        id: `${dept.id}-q1`,
        text: 'Were the imaging procedures explained clearly to you?',
        type: 'radio',
        required: true,
        options: ['Yes, very clearly', 'Somewhat clearly', 'Not clearly enough', 'Not at all']
      });
    } else if (dept.id === 'billing') {
      dept.questions.push({
        id: `${dept.id}-q1`,
        text: 'Were the costs and charges explained clearly?',
        type: 'radio',
        required: true,
        options: ['Yes, very clearly', 'Somewhat clearly', 'Not clearly enough', 'Not at all']
      });
    }
  }
});

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

  // Generate some sample answers to questions
  const answers: Record<string, string | number> = {};
  departments[departmentIndex].questions.forEach(question => {
    if (question.type === 'rating') {
      answers[question.id] = Math.floor(Math.random() * 5) + 1;
    } else if (question.type === 'radio' || question.type === 'select') {
      if (question.options && question.options.length > 0) {
        const randomOption = Math.floor(Math.random() * question.options.length);
        answers[question.id] = question.options[randomOption];
      }
    } else {
      answers[question.id] = 'Sample text response';
    }
  });

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
    answers,
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

// Create visitor data
export const visitors: Visitor[] = Array(50).fill(null).map((_, index) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

  return {
    id: `visitor-${index + 1}`,
    name: `Visitor ${index + 1}`,
    email: `visitor${index + 1}@example.com`,
    phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    relationship: ['Family', 'Friend', 'Caregiver', 'Other'][Math.floor(Math.random() * 4)],
    createdAt: pastDate.toISOString(),
  };
});

export const visitorFeedbacks: VisitorFeedback[] = Array(30).fill(null).map((_, index) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
  const purposes: Array<'visiting_patient' | 'accompanying_patient' | 'other'> = ['visiting_patient', 'accompanying_patient', 'other'];
  const purposeIndex = Math.floor(Math.random() * purposes.length);
  
  return {
    id: `visitor-feedback-${index + 1}`,
    visitorId: visitors[Math.floor(Math.random() * visitors.length)].id,
    purpose: purposes[purposeIndex],
    experience: Math.floor(Math.random() * 5) + 1,
    cleanliness: Math.floor(Math.random() * 5) + 1,
    staff: Math.floor(Math.random() * 5) + 1,
    comments: `This is a sample visitor feedback comment #${index + 1}.`,
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
