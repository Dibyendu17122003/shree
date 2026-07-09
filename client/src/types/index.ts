export interface Session {
  sessionId: string;
  ip: string;
  userAgent: string;
  browser: string;
  device: string;
  os: string;
  location: string;
  city: string;
  completed: boolean;
  dateAccepted: boolean;
  startTime: string;
  endTime: string | null;
  completionPercentage: number;
  totalTimeSpent: number;
}

export interface QuestionAnswer {
  sessionId: string;
  question: string;
  questionKey: string;
  answer: string;
  answerValue: string;
  timeSpent: number;
  timestamp: string;
}

export interface DateSelection {
  sessionId: string;
  selectedDate: string;
  selectedTime: string;
  dateAccepted: boolean;
  promiseChecklist: string[];
  loveMeterValue: number;
  excitementLevel: string;
  timestamp: string;
}

export interface DashboardStats {
  totalVisits: number;
  completedSessions: number;
  currentVisitors: number;
  dateAccepted: number;
  avgCompletion: number;
  avgTime: number;
}

export interface AnswersGroup {
  sessionId: string;
  session: {
    browser: string;
    device: string;
    os: string;
    completed: boolean;
    dateAccepted: boolean;
    startTime: string;
    completionPercentage: number;
  } | null;
  answers: Record<string, string>;
  timestamp: string;
}

export interface ChartData {
  foodChoices: { _id: string; count: number }[];
  locationChoices: { _id: string; count: number }[];
  dailyVisits: { _id: string; count: number }[];
  deviceStats: { _id: string; count: number }[];
  browserStats: { _id: string; count: number }[];
}

export interface Question {
  key: string;
  question: string;
  type: 'single' | 'multi' | 'slider' | 'checklist' | 'date' | 'textinput' | 'time';
  options?: { label: string; value: string; emoji?: string }[];
  max?: number;
  customOption?: boolean;
}

export interface StoredState {
  sessionId: string;
  currentStep: number;
  answers: Record<string, string>;
  dateAccepted: boolean;
  questionStartTime: number;
}
