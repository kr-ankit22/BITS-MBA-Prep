
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export enum Topic {
  Analytics = 'Analytics',
  Product = 'Product Management',
  Finance = 'Finance',
  Consulting = 'Consulting',
  Behavioral = 'Behavioral',
  SQL = 'SQL',
  Python = 'Python',
  DataScience = 'Data Science',
  General = 'General'
}

// export type QuestionCategory = 'Technical' | 'Behavioral' | 'HR' | 'Case'; // Removed


export interface Company {
  id: string;
  name: string;
  sector: string;
  logo: string;
  description: string;
  roles: string[];
}

export interface Question {
  id: string;
  companyId: string;
  companyName: string; // Denormalized for easier display/filtering
  text: string;
  topic: Topic | string | null;
  // category removed
  difficulty: Difficulty;


  idealApproach?: string; // Renamed from answer
  frequency: number;
  askedInBITS: boolean;
  role: string; // Specific role context
  domain: string;
  interviewExperienceId?: string; // Link to parent experience
}

export interface InterviewRound {
  id: string;
  type: 'Online Test' | 'Technical' | 'HR' | 'Case Study' | 'Managerial' | 'Group Discussion';
  difficulty: Difficulty;
  duration?: string;
  description?: string;
  questions: {
    text: string;
    answer?: string;
  }[];
}

export interface InterviewExperience {
  id: string;
  companyId: string;
  companyName: string;
  studentName: string; // 'Anonymous' if hidden
  role: string;
  date: string;
  difficulty: Difficulty;
  outcome: 'Offer' | 'Rejected' | 'Waitlisted' | 'Unknown';
  overallExperience: string;

  // Legacy support: Single list of questions
  questions: Question[];

  // V2 Support: Structured Rounds
  roundsSnapshot?: InterviewRound[];
  status?: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string; // New: Feedback from admin
  term?: string; // New: e.g. "Summer 2024"
  likes?: number; // New: Engagement
  isVerified?: boolean; // New: Trusted student
  contributorId?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string; // Python, SQL, Product, etc.
  source: string;
  duration?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum RecommendationSubject {
  Python = 'Python',
  R = 'R Programming',
  DataViz = 'Data Visualization',
  Stats = 'Introduction to Statistics',
  TimeSeries = 'Time Series Analysis',
  DB = 'Database Modelling & Warehousing',
  Marketing = 'Marketing Management',
  Predictive = 'Predictive Analytics',
  DeepLearning = 'Deep Learning For Business',
  HR = 'Human Resources',
  NLP = 'NLP',
  Finance = 'Financial Analytics'
}

export interface Recommendation {
  id: string;
  facultyName: string;
  date: string;

  // Content
  title: string;
  url?: string;
  description: string;

  // Context
  subject: RecommendationSubject | string;

  // Pedagogy
  goal: string;
  expectedLearning: string;
  remarks?: string;
  timeToComplete?: string;
}

export type ViewState = 'home' | 'questions' | 'companies' | 'analytics' | 'admin' | 'resources' | 'faculty' | 'login' | 'recommendations' | 'contributor';
