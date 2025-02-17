
export interface InterviewMetrics {
    clarity: number;
    confidence: number;
    technical: number;
    communication: number;
  }
  
export interface InterviewFeedback {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    metrics?: Partial<InterviewMetrics>;
    detailed_feedback: string;
  }
  
export interface Interview {
    id: string;
    conversation: string;
    created_at: string;
    feedback?: InterviewFeedback;
  }
  
export interface FeedbackStatus {
    [key: string]: {
      loading: boolean;
      error: string | null;
    };
  }