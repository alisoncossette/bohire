export interface CandidateProfile {
  id: string;
  worldIdVerified: boolean;
  worldIdHash?: string;
  githubUsername?: string;
  githubConnected: boolean;
  linkedinConnected: boolean;
  linkedinData?: LinkedInProfile;
  aiAssessment?: AIAssessment;
  aiResume?: string;
  handle: string;
  createdAt: string;
}

export interface LinkedInProfile {
  name: string;
  headline?: string;
  summary?: string;
  positions?: Position[];
  education?: Education[];
}

export interface Position {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  school: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface GitHubRepo {
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  url: string;
  topics?: string[];
}

export interface AIAssessment {
  skills: string[];
  level: 'junior' | 'mid' | 'senior' | 'expert';
  topProjects: {
    name: string;
    description: string;
    techStack: string[];
    impact: string;
  }[];
  summary: string;
  strengths: string[];
  codeQuality: number; // 1-10
  activityLevel: 'low' | 'medium' | 'high';
  assessedAt: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}
