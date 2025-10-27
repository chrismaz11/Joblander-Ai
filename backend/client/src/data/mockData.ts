import {
  AiActivity,
  AnalyticsStat,
  CoverLetterRecord,
  InterviewPrepSet,
  JobRecord,
  LinkedInProfileRecord,
  NetworkingContact,
  OnboardingStep,
  ResumeRecord,
  SalaryPlaybook,
  SubscriptionPlan,
} from "@/types";

export const mockResumes: ResumeRecord[] = [
  {
    id: "resume-1",
    title: "Principal Product Designer Resume",
    updatedAt: "2025-02-18T15:32:00Z",
    status: "optimized",
    role: "Principal Product Designer",
    location: "New York, NY",
    atsScore: 92,
    improvements: [
      "Quantified impact of design systems rollout",
      "Added leadership section for cross-functional initiatives",
      "Tightened wording for ATS keyword alignment",
    ],
  },
  {
    id: "resume-2",
    title: "Staff Software Engineer Resume",
    updatedAt: "2025-02-17T12:05:00Z",
    status: "exported",
    role: "Staff Software Engineer",
    location: "Remote - North America",
    atsScore: 88,
    improvements: [
      "Optimized summary to highlight scope and metrics",
      "Strengthened bullet points with results and scale",
      "Suggested keyword additions for AI/ML stacks",
    ],
  },
  {
    id: "resume-3",
    title: "Growth Marketing Lead Resume",
    updatedAt: "2025-02-12T09:45:00Z",
    status: "draft",
    role: "Growth Marketing Lead",
    location: "Austin, TX",
    atsScore: 74,
    improvements: [
      "Recommended A/B testing metrics for campaign bullets",
      "Added awards section for performance recognition",
      "Suggested layout changes for readability",
    ],
  },
];

export const mockJobs: JobRecord[] = [
  {
    id: "job-1",
    title: "Director of AI Product Strategy",
    company: "NeuralBridge Labs",
    location: "San Francisco, CA",
    postedAt: "2025-02-19T10:00:00Z",
    salaryRange: "$210k - $260k + equity",
    tags: ["AI", "Product Strategy", "Leadership"],
    remote: false,
    compatibilityScore: 86,
    url: "https://jobs.neuralbridge.ai/director-product-strategy",
    description:
      "Lead cross-functional AI product initiatives and drive go-to-market strategy for enterprise offerings.",
  },
  {
    id: "job-2",
    title: "Principal UX Researcher",
    company: "Lumina Analytics",
    location: "Remote - US",
    postedAt: "2025-02-15T13:15:00Z",
    tags: ["UX Research", "Enterprise SaaS", "Quantitative"],
    remote: true,
    compatibilityScore: 92,
    url: "https://lumina.design/careers/principal-ux-researcher",
    description:
      "Design and execute global research programs that inform product vision, pricing, and adoption strategy.",
  },
  {
    id: "job-3",
    title: "Head of Growth Marketing",
    company: "Orbit Talent",
    location: "Austin, TX",
    postedAt: "2025-02-10T08:00:00Z",
    salaryRange: "$180k - $200k base + bonuses",
    tags: ["Demand Gen", "Lifecycle", "Leadership"],
    remote: false,
    compatibilityScore: 79,
    url: "https://orbitalent.com/careers/head-of-growth",
    description:
      "Own customer acquisition, activation, and expansion with a focus on PLG funnels and revenue velocity.",
  },
];

export const mockCoverLetters: CoverLetterRecord[] = [
  {
    id: "cl-1",
    jobTitle: "Director of AI Product Strategy",
    company: "NeuralBridge Labs",
    updatedAt: "2025-02-19T12:20:00Z",
    tone: "executive",
    status: "final",
    highlights: [
      "Executive narrative anchored in strategic outcomes",
      "Highlights cross-functional leadership for AI launches",
      "Aligns directly to company's mission and traction",
    ],
  },
  {
    id: "cl-2",
    jobTitle: "Principal UX Researcher",
    company: "Lumina Analytics",
    updatedAt: "2025-02-14T17:10:00Z",
    tone: "professional",
    status: "draft",
    highlights: [
      "Includes quantified research impact metrics",
      "Demonstrates global research program ownership",
      "Connects experience to customer empathy and retention",
    ],
  },
];

export const analyticsSnapshot: AnalyticsStat[] = [
  {
    id: "stat-1",
    label: "Active Subscribers",
    value: 1845,
    trend: 12.4,
    changeLabel: "vs last month",
    timeframe: "month",
  },
  {
    id: "stat-2",
    label: "AI Actions",
    value: 9643,
    trend: 18.9,
    changeLabel: "last 30 days",
    timeframe: "month",
  },
  {
    id: "stat-3",
    label: "Resume Exports",
    value: 1286,
    trend: -4.3,
    changeLabel: "month over month",
    timeframe: "month",
  },
  {
    id: "stat-4",
    label: "Enterprise Trials",
    value: 32,
    trend: 6.1,
    changeLabel: "in the past week",
    timeframe: "week",
  },
];

export const recentAiActivity: AiActivity[] = [
  {
    id: "ai-1",
    type: "resume",
    title: "Resume enhancement for Principal Designer",
    createdAt: "2025-02-19T15:45:00Z",
    metadata: { atsScore: 92, improvements: 7, template: "Atlas Executive" },
  },
  {
    id: "ai-2",
    type: "linkedin",
    title: "LinkedIn headline optimization",
    createdAt: "2025-02-19T14:10:00Z",
    metadata: { targetRole: "Head of Product", seoKeywords: 12 },
  },
  {
    id: "ai-3",
    type: "interview",
    title: "Interview prep: Executive leadership round",
    createdAt: "2025-02-19T13:05:00Z",
    metadata: { questionsGenerated: 15, difficulty: "advanced" },
  },
  {
    id: "ai-4",
    type: "job",
    title: "Compatibility analysis for Lumina Analytics",
    createdAt: "2025-02-18T21:55:00Z",
    metadata: { score: 92, matchedKeywords: 18 },
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Starter",
    price: "$0",
    description: "Perfect for early exploration of JobLander AI.",
    features: [
      "3 resume projects with AI enhancements",
      "2 cover letter generations per month",
      "Basic ATS scoring and feedback",
      "Access to job discovery with manual refresh",
    ],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29 /mo",
    description: "Unlock full AI guidance and automated job intelligence.",
    features: [
      "Unlimited resume and cover letter projects",
      "AI job matching with daily refresh",
      "LinkedIn optimizer and ATS deep scoring",
      "Interview prep and negotiation playbooks",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Talk to us",
    description: "Tailored solutions for career teams and universities.",
    features: [
      "White-label experience and custom domains",
      "Team analytics and cohort coaching",
      "Dedicated success manager and SLAs",
      "API access and advanced security controls",
    ],
    cta: "Book a strategy call",
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "step-profile",
    title: "Complete professional profile",
    description: "Tell us about your background so AI can contextualize support.",
    actionLabel: "Open profile wizard",
    completed: true,
  },
  {
    id: "step-resume",
    title: "Upload your baseline resume",
    description:
      "Upload a PDF or DOCX resume for AI-powered enhancements and analysis.",
    actionLabel: "Upload resume",
    completed: false,
  },
  {
    id: "step-goals",
    title: "Define your job search goals",
    description:
      "Select target roles, industries, and locations to personalize recommendations.",
    actionLabel: "Set targets",
    completed: false,
  },
];

export const interviewPrepSets: InterviewPrepSet[] = [
  {
    id: "interview-1",
    role: "Director of AI Product Strategy",
    stage: "executive",
    companyFocus: "NeuralBridge Labs",
    questions: [
      "Walk me through a time you guided a product strategy pivot using AI insights.",
      "How do you balance experimentation with responsible AI governance?",
      "What are the leading indicators you track for AI product-market fit?",
    ],
    focusAreas: [
      "Executive communication",
      "AI commercialization",
      "Cross-functional leadership",
    ],
    recommendedActions: [
      "Prepare framework for AI roadmap prioritization",
      "Highlight outcomes from stakeholder alignment workshops",
      "Showcase metrics tied to AI adoption and retention",
    ],
  },
  {
    id: "interview-2",
    role: "Principal UX Researcher",
    stage: "behavioral",
    companyFocus: "Lumina Analytics",
    questions: [
      "Describe how you scale research insights across global teams.",
      "Share a time you reconciled conflicting qual and quant findings.",
      "How do you design inclusive research programs?",
    ],
    focusAreas: [
      "Global research operations",
      "Storytelling with data",
      "Stakeholder influence",
    ],
    recommendedActions: [
      "Compile research playbook artifacts",
      "Identify success stories where insights drove measurable impact",
      "Map stakeholder communication cadence examples",
    ],
  },
];

export const salaryPlaybooks: SalaryPlaybook[] = [
  {
    id: "salary-1",
    role: "Director of AI Product Strategy",
    companyType: "Series C AI SaaS",
    currentOffer: "$220k base / 0.25% equity / 20% bonus",
    marketRange: "$230k - $260k base / 0.35% - 0.5% equity",
    leveragePoints: [
      "12 quarters of triple-digit ARR growth driven by AI launches",
      "Led cross-functional teams of 40+ in scaled organizations",
      "Published thought leadership on responsible AI frameworks",
    ],
    negotiationMoves: [
      "Anchor on market data from peer companies",
      "Request executive coaching stipend + quarterly strategy offsites",
      "Introduce phased equity vesting acceleration tied to KPI targets",
    ],
  },
  {
    id: "salary-2",
    role: "Principal UX Researcher",
    companyType: "Public SaaS",
    marketRange: "$190k - $215k base / 15% bonus / RSUs",
    leveragePoints: [
      "Built research practice from zero to a global center of excellence",
      "Expertise in mixed methods and GTM enablement",
      "Led insights that unlocked 28% uplift in enterprise conversion",
    ],
    negotiationMoves: [
      "Request level calibration aligned to Staff IC band",
      "Ask for research ops budget and tooling support",
      "Layer relocation or remote flexibility incentives",
    ],
  },
];

export const networkingContacts: NetworkingContact[] = [
  {
    id: "contact-1",
    name: "Alex Ramos",
    title: "VP Product Strategy",
    company: "NeuralBridge Labs",
    relationship: "mutual",
    lastInteraction: "2025-02-12",
    recommendedAction:
      "Send congrats on recent product launch and request virtual coffee.",
    linkedin: "https://linkedin.com/in/alex-ramos",
    notes: "Mutual connection through Sarah Lin (former colleague).",
  },
  {
    id: "contact-2",
    name: "Priya Desai",
    title: "Head of Research Operations",
    company: "Lumina Analytics",
    relationship: "warm",
    lastInteraction: "2025-02-01",
    recommendedAction:
      "Share case study on scaling global research programs and ask for referral.",
    linkedin: "https://linkedin.com/in/priya-desai",
    notes: "Collaborated on industry report in 2023.",
  },
  {
    id: "contact-3",
    name: "Jordan Everett",
    title: "Chief Growth Officer",
    company: "Orbit Talent",
    relationship: "cold",
    lastInteraction: "2024-11-08",
    recommendedAction:
      "Engage via thought leadership on growth marketing analytics.",
    linkedin: "https://linkedin.com/in/jordan-everett",
  },
];

export const linkedinProfiles: LinkedInProfileRecord[] = [
  {
    id: "linkedin-1",
    title: "Executive AI Product Leader Profile",
    targetRole: "Director of AI Product Strategy",
    targetIndustry: "Enterprise AI SaaS",
    headlineScore: 92,
    aboutScore: 88,
    skillsRecommended: [
      "Strategic Roadmapping",
      "AI Governance",
      "Enterprise GTM",
      "Cross-functional Leadership",
    ],
    seoKeywords: [
      "AI Product Strategy",
      "Responsible AI",
      "Growth Leadership",
      "Enterprise SaaS",
      "Product Innovation",
    ],
    lastOptimized: "2025-02-18T21:10:00Z",
  },
];
