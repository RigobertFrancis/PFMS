
// export interface Feedback {
//   id: string;
//   patientId: string;
//   departmentId: string;
//   type: 'complaint' | 'suggestion' | 'compliment';
//   title: string;
//   description: string;
//   status: 'new' | 'in-progress' | 'resolved' | 'closed';
//   priority: 'low' | 'medium' | 'high' | 'urgent';
//   createdAt: string;
//   updatedAt: string;
//   requiresAttention: boolean;
//   answers?: Record<string, string | number>; // Answers to custom questions
// }

// export interface Department {
//   id: string;
//   name: string;
//   description?: string;
//   priority: 'low' | 'medium' | 'high' | 'critical';
//   totalFeedback: number;
//   feedbackByType: {
//     complaints: number;
//     suggestions: number;
//     compliments: number;
//   };
//   questions: Question[];
// }

// export interface Question {
//   id: string;
//   questionText: string;
//   questionType: 'TEXT' | 'RATING' | 'DROPDOWN' | 'RADIO';
//   required: boolean;
//   options?: string[]; // For select and radio questions
// }

// export interface Visitor {
//   id: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   relationship?: string;
//   createdAt: string;
// }

// export interface VisitorFeedback {
//   id: string;
//   visitorId: string;
//   purpose: 'visiting_patient' | 'accompanying_patient' | 'other';
//   experience: number; // Rating 1-5
//   cleanliness: number; // Rating 1-5
//   staff: number; // Rating 1-5
//   comments: string;
//   createdAt: string;
//   answers?: Record<string, string | number>; // Answers to custom questions
// }

// export interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   read: boolean;
//   createdAt: string;
// }

// export interface FeedbackSummary {
//   total: number;
//   byDepartment: Record<string, number>;
//   byType: {
//     complaints: number;
//     suggestions: number;
//     compliments: number;
//   };
//   requiresAttention: number;
// }

// export interface ChartData {
//   week: number;
//   complaints: number;
//   suggestions: number;
//   compliments: number;
// }

// export interface ReportTemplate {
//   id: string;
//   name: string;
//   description: string;
//   type: 'feedback-summary' | 'department-performance' | 'response-times' | 'satisfaction-scores' | 'trending-issues';
//   template: string;
//   createdAt: string;
// }
