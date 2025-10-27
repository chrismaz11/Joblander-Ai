import { lazy } from "react";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  Linkedin,
  MessageCircle,
  PenLine,
  Scale,
  Shield,
  Sparkles,
  Target,
  UploadCloud,
  UserCircle,
  Users,
} from "lucide-react";
import { SubscriptionTier } from "@/types";

const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const ResumeBuilderPage = lazy(() =>
  import("@/pages/ResumeBuilderPage").then((module) => ({
    default: module.ResumeBuilderPage,
  })),
);
const JobSearchPage = lazy(() =>
  import("@/pages/JobSearchPage").then((module) => ({
    default: module.JobSearchPage,
  })),
);
const CoverLettersPage = lazy(() =>
  import("@/pages/CoverLettersPage").then((module) => ({
    default: module.CoverLettersPage,
  })),
);
const LinkedInOptimizerPage = lazy(() =>
  import("@/pages/LinkedInOptimizerPage").then((module) => ({
    default: module.LinkedInOptimizerPage,
  })),
);
const InterviewPrepPage = lazy(() =>
  import("@/pages/InterviewPrepPage").then((module) => ({
    default: module.InterviewPrepPage,
  })),
);
const SalaryNegotiationPage = lazy(() =>
  import("@/pages/SalaryNegotiationPage").then((module) => ({
    default: module.SalaryNegotiationPage,
  })),
);
const NetworkingHubPage = lazy(() =>
  import("@/pages/NetworkingHubPage").then((module) => ({
    default: module.NetworkingHubPage,
  })),
);
const AnalyticsPage = lazy(() =>
  import("@/pages/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  })),
);
const AdminPanelPage = lazy(() =>
  import("@/pages/AdminPanelPage").then((module) => ({
    default: module.AdminPanelPage,
  })),
);
const UpgradePage = lazy(() =>
  import("@/pages/UpgradePage").then((module) => ({
    default: module.UpgradePage,
  })),
);
const OnboardingPage = lazy(() =>
  import("@/pages/OnboardingPage").then((module) => ({
    default: module.OnboardingPage,
  })),
);
const JobImporterPage = lazy(() =>
  import("@/pages/JobImporterPage").then((module) => ({
    default: module.JobImporterPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);

export type RouteCategory = "workspace" | "ai" | "growth" | "admin";

export interface AppRoute {
  path: string;
  label: string;
  description: string;
  icon: LucideIcon;
  category: RouteCategory;
  component: ComponentType;
  tier?: SubscriptionTier;
}

export const appRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "AI snapshot of everything happening in your career workspace.",
    icon: Sparkles,
    category: "workspace",
    component: DashboardPage,
  },
  {
    path: "/resume-builder",
    label: "Resume Builder",
    description: "Gemini-powered resume enhancements and ATS optimizations.",
    icon: FileText,
    category: "workspace",
    component: ResumeBuilderPage,
  },
  {
    path: "/job-search",
    label: "Job Search",
    description: "AI-curated job discovery with compatibility scoring.",
    icon: BriefcaseBusiness,
    category: "workspace",
    component: JobSearchPage,
  },
  {
    path: "/cover-letters",
    label: "Cover Letters",
    description: "Executive-grade pitch decks generated from your resume.",
    icon: PenLine,
    category: "ai",
    component: CoverLettersPage,
  },
  {
    path: "/linkedin-optimizer",
    label: "LinkedIn Optimizer",
    description: "Make your profile rank for the roles you want next.",
    icon: Linkedin,
    category: "ai",
    component: LinkedInOptimizerPage,
  },
  {
    path: "/interview-prep",
    label: "Interview Prep",
    description: "Role-specific questions, story prompts, and mock interviews.",
    icon: MessageCircle,
    category: "ai",
    component: InterviewPrepPage,
  },
  {
    path: "/salary-negotiation",
    label: "Salary Negotiation",
    description: "Benchmark data and negotiation scripts for better offers.",
    icon: Scale,
    category: "growth",
    component: SalaryNegotiationPage,
  },
  {
    path: "/networking",
    label: "Networking Hub",
    description: "Activate your network with AI-crafted outreach.",
    icon: Users,
    category: "growth",
    component: NetworkingHubPage,
  },
  {
    path: "/analytics",
    label: "Analytics",
    description: "Monitor revenue, AI usage, and conversion health.",
    icon: BarChart3,
    category: "admin",
    component: AnalyticsPage,
    tier: "pro",
  },
  {
    path: "/admin",
    label: "Admin Panel",
    description: "Manage users, security, and system configuration.",
    icon: Shield,
    category: "admin",
    component: AdminPanelPage,
    tier: "pro",
  },
  {
    path: "/upgrade",
    label: "Upgrade",
    description: "Compare tiers and unlock premium AI capability.",
    icon: CreditCard,
    category: "growth",
    component: UpgradePage,
  },
  {
    path: "/onboarding",
    label: "Onboarding",
    description: "Complete guided setup to personalize JobLander.",
    icon: Target,
    category: "workspace",
    component: OnboardingPage,
  },
  {
    path: "/job-importer",
    label: "Job Importer",
    description: "Bulk ingest job pipelines via CSV.",
    icon: UploadCloud,
    category: "workspace",
    component: JobImporterPage,
    tier: "pro",
  },
  {
    path: "/profile",
    label: "Profile",
    description: "Manage account preferences, identity, and security.",
    icon: UserCircle,
    category: "workspace",
    component: ProfilePage,
  },
];
