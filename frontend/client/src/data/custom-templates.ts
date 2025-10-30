export type TemplateCategory =
  | "ATS-Friendly"
  | "Modern"
  | "Creative"
  | "Minimal"
  | "Executive"
  | "Academic"
  | "Technical";

export interface TemplateSamplePerson {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
}

export interface TemplateSpec {
  id: string;
  name: string;
  category: TemplateCategory;
  isPremium: boolean;
  isATSFriendly: boolean;
  atsScore: number;
  photoOption: boolean;
  layout: "single_column" | "two_column";
  colorScheme: [string, string, string];
  fontFamily: string;
  description: string;
  recommendedFor: string[];
  samplePerson: TemplateSamplePerson;
}

// Your custom templates with exact specifications
export const TEMPLATES: TemplateSpec[] = [
  {
    id: "classic_blue",
    name: "Classic Blue",
    category: "ATS-Friendly",
    isPremium: false,
    isATSFriendly: true,
    atsScore: 98,
    photoOption: false,
    layout: "single_column",
    colorScheme: ["#004E92", "#FFFFFF", "#1F1F1F"],
    fontFamily: "Inter",
    description: "Clean corporate layout with blue header bar and simple section dividers.",
    recommendedFor: ["Corporate", "Finance", "Consulting"],
    samplePerson: {
      name: "Emily Roberts",
      title: "Project Manager",
      email: "emily.roberts@email.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
    },
  },
  {
    id: "modern_minimalist",
    name: "Modern Minimalist",
    category: "ATS-Friendly",
    isPremium: false,
    isATSFriendly: true,
    atsScore: 95,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#2E2E2E", "#FFFFFF", "#DDDDDD"],
    fontFamily: "Roboto",
    description: "Minimal design with bold section titles and soft gray accents.",
    recommendedFor: ["Tech", "Startups", "General Business"],
    samplePerson: {
      name: "Marcus Rivera",
      title: "Software Engineer",
      email: "marcus.rivera@email.com",
      phone: "+1 (555) 345-6789",
      location: "San Francisco, CA",
    },
  },
  {
    id: "timeline_pro",
    name: "Timeline Pro",
    category: "Modern",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 88,
    photoOption: false,
    layout: "single_column",
    colorScheme: ["#32465a", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Modern layout emphasizing timeline pro style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Timeline",
      title: "Specialist",
      email: "alex.timeline@email.com",
      phone: "+1 (555) 456-7890",
      location: "Seattle, WA",
    },
  },
  {
    id: "executive_gold",
    name: "Executive Gold",
    category: "Minimal",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 89,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#394b5d", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Minimal layout emphasizing executive gold style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Executive",
      title: "Specialist",
      email: "alex.executive@email.com",
      phone: "+1 (555) 567-8901",
      location: "Boston, MA",
    },
  },
  {
    id: "creative_grid",
    name: "Creative Grid",
    category: "Creative",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 90,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#405060", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Creative layout emphasizing creative grid style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Creative",
      title: "Specialist",
      email: "alex.creative@email.com",
      phone: "+1 (555) 678-9012",
      location: "Los Angeles, CA",
    },
  },
  {
    id: "academic_scholar",
    name: "Academic Scholar",
    category: "Executive",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 91,
    photoOption: true,
    layout: "single_column",
    colorScheme: ["#475563", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Executive layout emphasizing academic scholar style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Academic",
      title: "Specialist",
      email: "alex.academic@email.com",
      phone: "+1 (555) 789-0123",
      location: "Cambridge, MA",
    },
  },
  {
    id: "tech_stack",
    name: "Tech Stack",
    category: "Academic",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 92,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#4e5a66", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Academic layout emphasizing tech stack style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Tech",
      title: "Specialist",
      email: "alex.tech@email.com",
      phone: "+1 (555) 890-1234",
      location: "Austin, TX",
    },
  },
  {
    id: "board_member",
    name: "Board Member",
    category: "Technical",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 93,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#555f69", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Technical layout emphasizing board member style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Board",
      title: "Specialist",
      email: "alex.board@email.com",
      phone: "+1 (555) 901-2345",
      location: "Chicago, IL",
    },
  },
  {
    id: "portfolio_slate",
    name: "Portfolio Slate",
    category: "Modern",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 94,
    photoOption: false,
    layout: "single_column",
    colorScheme: ["#5c646c", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Modern layout emphasizing portfolio slate style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Portfolio",
      title: "Specialist",
      email: "alex.portfolio@email.com",
      phone: "+1 (555) 012-3456",
      location: "Portland, OR",
    },
  },
  {
    id: "startup_vibe",
    name: "Startup Vibe",
    category: "Minimal",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 95,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#63696f", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Minimal layout emphasizing startup vibe style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Startup",
      title: "Specialist",
      email: "alex.startup@email.com",
      phone: "+1 (555) 123-4567",
      location: "Denver, CO",
    },
  },
  {
    id: "gradient_edge",
    name: "Gradient Edge",
    category: "Creative",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 96,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#6a6e72", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Creative layout emphasizing gradient edge style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Gradient",
      title: "Specialist",
      email: "alex.gradient@email.com",
      phone: "+1 (555) 234-5678",
      location: "Miami, FL",
    },
  },
  {
    id: "elite_executive",
    name: "Elite Executive",
    category: "Executive",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 97,
    photoOption: true,
    layout: "single_column",
    colorScheme: ["#717375", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Executive layout emphasizing elite executive style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Elite",
      title: "Specialist",
      email: "alex.elite@email.com",
      phone: "+1 (555) 345-6789",
      location: "Dallas, TX",
    },
  },
  {
    id: "research_cv",
    name: "Research CV",
    category: "Academic",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 88,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#787878", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Academic layout emphasizing research cv style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Research",
      title: "Specialist",
      email: "alex.research@email.com",
      phone: "+1 (555) 456-7890",
      location: "Philadelphia, PA",
    },
  },
  {
    id: "designer_pulse",
    name: "Designer Pulse",
    category: "Technical",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 89,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#7f7d7b", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Technical layout emphasizing designer pulse style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Designer",
      title: "Specialist",
      email: "alex.designer@email.com",
      phone: "+1 (555) 567-8901",
      location: "Phoenix, AZ",
    },
  },
  {
    id: "innovator_resume",
    name: "Innovator Resume",
    category: "Modern",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 90,
    photoOption: false,
    layout: "single_column",
    colorScheme: ["#86827e", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Modern layout emphasizing innovator resume style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Innovator",
      title: "Specialist",
      email: "alex.innovator@email.com",
      phone: "+1 (555) 678-9012",
      location: "San Diego, CA",
    },
  },
  {
    id: "bold_vision",
    name: "Bold Vision",
    category: "Minimal",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 91,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#8d8781", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Minimal layout emphasizing bold vision style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Bold",
      title: "Specialist",
      email: "alex.bold@email.com",
      phone: "+1 (555) 789-0123",
      location: "Nashville, TN",
    },
  },
  {
    id: "streamline",
    name: "Streamline",
    category: "Creative",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 92,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#948c84", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Creative layout emphasizing streamline style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Streamline",
      title: "Specialist",
      email: "alex.streamline@email.com",
      phone: "+1 (555) 890-1234",
      location: "Charlotte, NC",
    },
  },
  {
    id: "digital_blueprint",
    name: "Digital Blueprint",
    category: "Executive",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 93,
    photoOption: true,
    layout: "single_column",
    colorScheme: ["#9b9187", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Executive layout emphasizing digital blueprint style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Digital",
      title: "Specialist",
      email: "alex.digital@email.com",
      phone: "+1 (555) 901-2345",
      location: "Minneapolis, MN",
    },
  },
  {
    id: "sleek_contrast",
    name: "Sleek Contrast",
    category: "Academic",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 94,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#a2968a", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Academic layout emphasizing sleek contrast style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Sleek",
      title: "Specialist",
      email: "alex.sleek@email.com",
      phone: "+1 (555) 012-3456",
      location: "Detroit, MI",
    },
  },
  {
    id: "monochrome_classic",
    name: "Monochrome Classic",
    category: "Technical",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 95,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#a99b8d", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Technical layout emphasizing monochrome classic style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Monochrome",
      title: "Specialist",
      email: "alex.monochrome@email.com",
      phone: "+1 (555) 123-4567",
      location: "Milwaukee, WI",
    },
  },
  {
    id: "urban_professional",
    name: "Urban Professional",
    category: "Modern",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 96,
    photoOption: false,
    layout: "single_column",
    colorScheme: ["#b0a090", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Modern layout emphasizing urban professional style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Urban",
      title: "Specialist",
      email: "alex.urban@email.com",
      phone: "+1 (555) 234-5678",
      location: "Columbus, OH",
    },
  },
  {
    id: "consultant_gray",
    name: "Consultant Gray",
    category: "Minimal",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 97,
    photoOption: true,
    layout: "two_column",
    colorScheme: ["#b7a593", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Minimal layout emphasizing consultant gray style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Consultant",
      title: "Specialist",
      email: "alex.consultant@email.com",
      phone: "+1 (555) 345-6789",
      location: "Indianapolis, IN",
    },
  },
  {
    id: "scholar_plus",
    name: "Scholar Plus",
    category: "Creative",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 88,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#beaa96", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Creative layout emphasizing scholar plus style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Scholar",
      title: "Specialist",
      email: "alex.scholar@email.com",
      phone: "+1 (555) 456-7890",
      location: "Jacksonville, FL",
    },
  },
  {
    id: "tech_vanguard",
    name: "Tech Vanguard",
    category: "Executive",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 89,
    photoOption: true,
    layout: "single_column",
    colorScheme: ["#c5af99", "#FFFFFF", "#222222"],
    fontFamily: "Poppins",
    description:
      "Executive layout emphasizing tech vanguard style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Tech",
      title: "Specialist",
      email: "alex.tech@email.com",
      phone: "+1 (555) 567-8901",
      location: "San Antonio, TX",
    },
  },
  {
    id: "creative_aura",
    name: "Creative Aura",
    category: "Academic",
    isPremium: true,
    isATSFriendly: false,
    atsScore: 90,
    photoOption: false,
    layout: "two_column",
    colorScheme: ["#ccb49c", "#FFFFFF", "#222222"],
    fontFamily: "Inter",
    description:
      "Academic layout emphasizing creative aura style with modern section placement and clean typography.",
    recommendedFor: ["Tech", "Creative", "Business"],
    samplePerson: {
      name: "Alex Creative",
      title: "Specialist",
      email: "alex.creative@email.com",
      phone: "+1 (555) 678-9012",
      location: "Fort Worth, TX",
    },
  },
];

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, TemplateCategory> = {
  "ATS-Friendly": "ATS-Friendly",
  Modern: "Modern",
  Creative: "Creative",
  Minimal: "Minimal",
  Executive: "Executive",
  Academic: "Academic",
  Technical: "Technical",
};

export function getTemplateById(id: string): TemplateSpec | undefined {
  return TEMPLATES.find((template) => template.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory | "all"): TemplateSpec[] {
  if (category === "all") {
    return TEMPLATES;
  }
  return TEMPLATES.filter((template) => template.category === category);
}

export function getFreeTemplates(): TemplateSpec[] {
  return TEMPLATES.filter((template) => !template.isPremium);
}

export function getPremiumTemplates(): TemplateSpec[] {
  return TEMPLATES.filter((template) => template.isPremium);
}

export function getRecommendedTemplates(industry: string): TemplateSpec[] {
  if (!industry) {
    return [...TEMPLATES].sort((a, b) => b.atsScore - a.atsScore).slice(0, 3);
  }

  return TEMPLATES.filter((template) =>
    template.recommendedFor.some((recommendation) =>
      recommendation.toLowerCase().includes(industry.toLowerCase()),
    ),
  )
    .sort((a, b) => b.atsScore - a.atsScore)
    .slice(0, 3);
}
