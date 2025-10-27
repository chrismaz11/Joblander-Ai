export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  tier: SubscriptionTier;
  avatarUrl?: string;
  onboardingComplete: boolean;
  company?: string;
  lastLogin?: string;
  aiCredits: number;
  resumesCreated: number;
  coverLettersCreated: number;
}

export interface ResumeRecord {
  id: string;
  title: string;
  updatedAt: string;
  status: "draft" | "optimized" | "exported";
  role: string;
  location: string;
  atsScore: number;
  improvements: string[];
}

export interface JobRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: string;
  salaryRange?: string;
  tags: string[];
  remote: boolean;
  compatibilityScore: number;
  url?: string;
  description: string;
}

export interface CoverLetterRecord {
  id: string;
  jobTitle: string;
  company: string;
  updatedAt: string;
  tone: "professional" | "enthusiastic" | "executive";
  status: "draft" | "final";
  highlights: string[];
}

export interface AnalyticsStat {
  id: string;
  label: string;
  value: number | string;
  trend: number;
  changeLabel: string;
  timeframe: "day" | "week" | "month" | "quarter";
}

export interface AiActivity {
  id: string;
  type: "resume" | "coverLetter" | "job" | "linkedin" | "interview";
  title: string;
  createdAt: string;
  metadata: Record<string, string | number>;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  completed: boolean;
}

export interface InterviewPrepSet {
  id: string;
  role: string;
  stage: "behavioral" | "technical" | "leadership" | "executive";
  companyFocus: string;
  questions: string[];
  focusAreas: string[];
  recommendedActions: string[];
}

export interface SalaryPlaybook {
  id: string;
  role: string;
  companyType: string;
  currentOffer?: string;
  marketRange: string;
  leveragePoints: string[];
  negotiationMoves: string[];
}

export interface NetworkingContact {
  id: string;
  name: string;
  title: string;
  company: string;
  relationship: "warm" | "mutual" | "cold";
  lastInteraction: string;
  recommendedAction: string;
  linkedin?: string;
  notes?: string;
}

export interface LinkedInProfileRecord {
  id: string;
  title: string;
  targetRole: string;
  targetIndustry: string;
  headlineScore: number;
  aboutScore: number;
  skillsRecommended: string[];
  seoKeywords: string[];
  lastOptimized: string;
}
