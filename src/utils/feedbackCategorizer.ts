// Feedback categorization utility for web application
export interface FeedbackCategory {
  overall: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1, how confident we are in the categorization
  reasoning: string[];
}

export interface Question {
  id: number;
  questionText: string;
  questionType: 'RADIO' | 'RATING' | 'TEXT';
  options?: string[];
  required: boolean;
  departmentId: number;
}

export interface Feedback {
  id: string;
  category: string;
  question: string;
  questionAnswer: string;
  createdAt: string;
  departmentId: number;
  patientId: number;
}

// Define positive and negative keywords for text analysis
const POSITIVE_KEYWORDS = [
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect', 'satisfied',
  'happy', 'pleased', 'impressed', 'helpful', 'caring', 'professional', 'clean', 'efficient',
  'quick', 'fast', 'timely', 'polite', 'friendly', 'kind', 'attentive', 'thorough'
];

const NEGATIVE_KEYWORDS = [
  'bad', 'terrible', 'awful', 'horrible', 'disappointed', 'unsatisfied', 'unhappy', 'angry',
  'frustrated', 'upset', 'poor', 'slow', 'dirty', 'unclean', 'rude', 'unprofessional',
  'unhelpful', 'uncaring', 'neglected', 'ignored', 'long wait', 'delayed', 'late'
];

// Radio option sentiment mapping
const RADIO_SENTIMENT_MAP: { [key: string]: number } = {
  // Positive options (score: 1)
  'yes': 1, 'yes, perfectly': 1, 'yes, very efficiently': 1, 'excellent': 1, 'very good': 1,
  'very satisfied': 1, 'very helpful': 1, 'very professional': 1, 'very clean': 1,
  
  // Slightly positive options (score: 0.6)
  'yes, somewhat': 0.6, 'somewhat efficiently': 0.6, 'good': 0.6, 'satisfied': 0.6,
  'helpful': 0.6, 'professional': 0.6, 'clean': 0.6, 'somewhat': 0.6,
  
  // Neutral options (score: 0.5)
  'neutral': 0.5, 'okay': 0.5, 'average': 0.5, 'moderate': 0.5,
  
  // Slightly negative options (score: 0.4)
  'no, not at all': 0.4, 'not very efficiently': 0.4, 'poor': 0.4, 'unsatisfied': 0.4,
  'unhelpful': 0.4, 'unprofessional': 0.4, 'dirty': 0.4, 'not very': 0.4,
  
  // Negative options (score: 0)
  'no': 0, 'not at all efficiently': 0, 'terrible': 0, 'very poor': 0, 'very unsatisfied': 0,
  'very unhelpful': 0, 'very unprofessional': 0, 'very dirty': 0
};

/**
 * Analyze text sentiment using keyword matching
 */
function analyzeTextSentiment(text: string): number {
  if (!text || typeof text !== 'string') return 0.5;
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  POSITIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) positiveCount++;
  });
  
  NEGATIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) negativeCount++;
  });
  
  if (positiveCount === 0 && negativeCount === 0) return 0.5; // Neutral
  
  const total = positiveCount + negativeCount;
  return positiveCount / total; // Returns 0-1, where 1 is positive
}

/**
 * Categorize a single feedback answer
 */
function categorizeAnswer(feedback: Feedback): { sentiment: number; confidence: number } {
  if (!feedback.questionAnswer || feedback.questionAnswer === '' || feedback.questionAnswer === null || feedback.questionAnswer === undefined) {
    return { sentiment: 0.5, confidence: 0.1 }; // Neutral with low confidence
  }
  
  const answer = feedback.questionAnswer.toLowerCase();
  
  // Check if it's a rating (numeric)
  const ratingMatch = answer.match(/^(\d+)(?:\/5)?$/);
  if (ratingMatch) {
    const rating = parseInt(ratingMatch[1]);
    if (rating <= 2) return { sentiment: 0.2, confidence: 0.9 };
    if (rating === 3) return { sentiment: 0.5, confidence: 0.8 };
    return { sentiment: 0.8, confidence: 0.9 };
  }
  
  // Check for radio button options
  const sentiment = RADIO_SENTIMENT_MAP[answer];
  if (sentiment !== undefined) {
    return { sentiment, confidence: 0.8 };
  }
  
  // Analyze text sentiment
  const textSentiment = analyzeTextSentiment(feedback.questionAnswer);
  return { sentiment: textSentiment, confidence: 0.6 };
}

/**
 * Categorize overall feedback based on category and answer
 */
export function categorizeFeedback(feedback: Feedback): FeedbackCategory {
  const reasoning: string[] = [];
  
  // Factor in the feedback category
  let categorySentiment = 0.5;
  switch (feedback.category?.toUpperCase()) {
    case 'COMPLIMENT':
      categorySentiment = 0.9;
      reasoning.push('User selected compliment as feedback type');
      break;
    case 'COMPLAINT':
      categorySentiment = 0.1;
      reasoning.push('User selected complaint as feedback type');
      break;
    case 'SUGGESTION':
      categorySentiment = 0.6; // Slightly positive
      reasoning.push('User selected suggestion as feedback type');
      break;
  }
  
  // Analyze the answer
  const { sentiment: answerSentiment, confidence: answerConfidence } = categorizeAnswer(feedback);
  
  // Combine category and answer sentiment
  const categoryWeight = 0.4; // Category has 40% weight
  const answerWeight = 0.6; // Answer has 60% weight
  
  const overallSentiment = (categorySentiment * categoryWeight) + (answerSentiment * answerWeight);
  const confidence = Math.min((answerConfidence + 0.2), 1); // Boost confidence with category info
  
  // Add reasoning for answer
  if (answerSentiment > 0.7) {
    reasoning.push(`Positive response: "${feedback.questionAnswer}"`);
  } else if (answerSentiment < 0.3) {
    reasoning.push(`Negative response: "${feedback.questionAnswer}"`);
  }
  
  // Determine category
  let overall: 'positive' | 'negative' | 'neutral';
  if (overallSentiment >= 0.6) {
    overall = 'positive';
  } else if (overallSentiment <= 0.4) {
    overall = 'negative';
  } else {
    overall = 'neutral';
  }
  
  // Add overall reasoning
  if (reasoning.length === 0) {
    reasoning.push('Insufficient data for detailed analysis');
  }
  
  return {
    overall,
    confidence,
    reasoning
  };
}

/**
 * Cluster feedback by user and categorize each user's overall feedback
 */
export interface UserFeedbackCluster {
  patientId: number;
  feedbacks: Feedback[];
  overallCategory: FeedbackCategory;
  totalFeedbacks: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  lastFeedbackDate: string;
}

export function clusterUserFeedback(feedbacks: Feedback[]): UserFeedbackCluster[] {
  // Group feedbacks by patient ID
  const userGroups = feedbacks.reduce((groups, feedback) => {
    const patientId = feedback.patientId;
    if (!groups[patientId]) {
      groups[patientId] = [];
    }
    groups[patientId].push(feedback);
    return groups;
  }, {} as { [key: number]: Feedback[] });
  
  // Process each user's feedback
  return Object.entries(userGroups).map(([patientId, userFeedbacks]) => {
    // Sort feedbacks by date (most recent first)
    const sortedFeedbacks = userFeedbacks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Categorize each feedback
    const categorizedFeedbacks = sortedFeedbacks.map(feedback => ({
      ...feedback,
      category: categorizeFeedback(feedback)
    }));
    
    // Count categories
    const positiveCount = categorizedFeedbacks.filter(f => f.category.overall === 'positive').length;
    const negativeCount = categorizedFeedbacks.filter(f => f.category.overall === 'negative').length;
    const neutralCount = categorizedFeedbacks.filter(f => f.category.overall === 'neutral').length;
    
    // Calculate overall category based on majority
    let overallCategory: 'positive' | 'negative' | 'neutral';
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      overallCategory = 'positive';
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      overallCategory = 'negative';
    } else {
      overallCategory = 'neutral';
    }
    
    // Calculate overall confidence based on consistency
    const total = categorizedFeedbacks.length;
    const confidence = total > 0 ? Math.max(positiveCount, negativeCount, neutralCount) / total : 0;
    
    return {
      patientId: parseInt(patientId),
      feedbacks: sortedFeedbacks,
      overallCategory: {
        overall: overallCategory,
        confidence,
        reasoning: [`${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral feedbacks`]
      },
      totalFeedbacks: total,
      positiveCount,
      negativeCount,
      neutralCount,
      lastFeedbackDate: sortedFeedbacks[0]?.createdAt || ''
    };
  }).sort((a, b) => new Date(b.lastFeedbackDate).getTime() - new Date(a.lastFeedbackDate).getTime());
}

/**
 * Get a human-readable summary of the categorization
 */
export function getCategorizationSummary(category: FeedbackCategory): string {
  const confidencePercent = Math.round(category.confidence * 100);
  
  switch (category.overall) {
    case 'positive':
      return `Positive feedback (${confidencePercent}% confidence)`;
    case 'negative':
      return `Negative feedback (${confidencePercent}% confidence)`;
    case 'neutral':
      return `Neutral feedback (${confidencePercent}% confidence)`;
    default:
      return 'Unable to categorize feedback';
  }
} 