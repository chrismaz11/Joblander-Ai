export type BillingFrequency = "monthly" | "quarterly" | "annual" | "one_time";

export type Plan = {
  id: string;
  name: string;
  price: string;
  frequency: BillingFrequency;
  description: string;
  bulletPoints: string[];
  trial?: {
    price: string;
    durationDays: number;
  };
  highlight?: boolean;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    frequency: "monthly",
    description: "Perfect for exploring the editor and drafting your first resume.",
    bulletPoints: [
      "1 active resume stored in the cloud",
      "Autosave, shareable link with brand watermark",
      "3 starter templates and base fonts",
      "In-editor upgrade nudges only when exporting",
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: "$11.99",
    frequency: "monthly",
    description:
      "Full access to the resume builder with flexible month-to-month billing.",
    bulletPoints: [
      "Unlimited resumes, cover letters, and template switching",
      "PDF, DOCX, and print-ready exports without watermark",
      "AI phrasing suggestions and smart section ordering",
      "Priority chat and email support",
    ],
    trial: {
      price: "$1.99",
      durationDays: 7,
    },
    highlight: true,
  },
  {
    id: "pro-quarterly",
    name: "Pro Quarterly",
    price: "$27.99",
    frequency: "quarterly",
    description: "Upgrade to the growth toolkit and save 22% versus monthly.",
    bulletPoints: [
      "Everything in Pro Monthly",
      "ATS preview scoring & keyword gap insights",
      "Cover letter generator with reusable snippets",
      "Application tracker CSV exports",
    ],
  },
  {
    id: "pro-annual",
    name: "Pro Annual",
    price: "$79.99",
    frequency: "annual",
    description: "Best value: serious job hunters get long-term resources.",
    bulletPoints: [
      "Everything in Pro Quarterly",
      "Interview prep workbook and practice prompts",
      "1 expert resume review credit per year",
      "Early access to premium template drops",
    ],
  },
  {
    id: "credit-pack",
    name: "Resume Credit Pack",
    price: "$4.99",
    frequency: "one_time",
    description:
      "Need a single export? Purchase a credit without subscribing.",
    bulletPoints: [
      "One high-resolution PDF or DOCX export",
      "Access to premium templates for 24 hours",
      "Credits never expire",
      "Discounted upgrade when you subscribe later",
    ],
  },
];

export const planIdToStripePriceEnv: Record<string, string> = {
  "pro-monthly": "STRIPE_PRICE_PRO_MONTHLY",
  "pro-quarterly": "STRIPE_PRICE_PRO_QUARTERLY",
  "pro-annual": "STRIPE_PRICE_PRO_ANNUAL",
  "credit-pack": "STRIPE_PRICE_RESUME_CREDIT",
};
