const baseTheme = {
  layout: "two-column",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  headingFont: "'Inter Tight', 'Inter', sans-serif",
  maxWidth: "960px",
  backgroundColor: "#F8FAFC",
  cardBackground: "#ffffff",
  accentColor: "#1D4ED8",
  accentTextColor: "#ffffff",
  textColor: "#0f172a",
  mutedColor: "#475569",
  borderColor: "#E2E8F0",
  headerBackground: "#ffffff",
  headerTextColor: "#0f172a",
  borderRadius: "28px",
  shadow: "0 40px 80px rgba(15, 23, 42, 0.12)",
  headingTransform: "uppercase",
  headingLetterSpacing: "0.18em",
  headingSize: "13px",
  bulletStyle: "disc",
  skillsLayout: "pill",
  experienceVariant: "standard",
  includeSuggestions: true,
  summaryPlacement: "primary",
  educationPlacement: "secondary",
  skillsPlacement: "secondary",
  suggestionsPlacement: "secondary",
  contactPlacement: "header",
  showHeaderContact: true,
  columnGap: "40px",
  secondaryBackground: "transparent",
  secondaryPadding: "0",
  secondaryRadius: "0",
  sectionSpacing: "36px",
  stackGap: "32px",
  bodyPadding: "48px 56px 56px",
  headerPadding: "52px 56px 40px",
  pagePadding: "56px 48px",
  primaryRatio: "2.2fr",
  secondaryRatio: "1fr",
  primaryBackground: "transparent",
  primaryPadding: "0",
  primaryRadius: "0",
  secondaryTextColor: "#0f172a",
  contactSeparator: "•",
  nameSize: "38px",
  nameWeight: 700,
  titleSize: "18px",
  titleWeight: 600,
  heroSummarySize: "17px",
  heroSummaryBackground: "transparent",
  labels: {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    insights: "Key Highlights",
    contact: "Contact",
  },
};

const templateDefinitions = [
  {
    id: "modern",
    name: "Modern Executive",
    description: "Gradient split-column layout with polished executive styling.",
    preview: "/resume-templates/template-01.png",
    theme: {
      backgroundColor: "#EEF2FF",
      headerBackground:
        "linear-gradient(135deg, rgba(29,78,216,0.12), rgba(14,165,233,0.10))",
      secondaryBackground: "rgba(29,78,216,0.05)",
      secondaryPadding: "32px 32px 36px",
      secondaryRadius: "24px",
      subtitleColor: "#1E3A8A",
      includeSuggestions: true,
      extraCss: `
        body.theme-modern .resume-header::after {
          content: "";
          position: absolute;
          left: 56px;
          right: 56px;
          bottom: -4px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #1D4ED8, #0EA5E9);
        }
        body.theme-modern .secondary-column::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(29,78,216,0.08), rgba(2,132,199,0.06));
          opacity: 0.6;
          z-index: -1;
        }
        body.theme-modern .secondary-column {
          position: relative;
        }
      `,
    },
  },
  {
    id: "sleek-vanguard",
    name: "Sleek Vanguard",
    description: "Structured two-column template with crisp dividers and ATS focus.",
    preview: "/resume-templates/template-02.jpg",
    theme: {
      accentColor: "#0EA5E9",
      subtitleColor: "#0284C7",
      skillsLayout: "grid",
      experienceVariant: "compact",
      secondaryBackground: "#ffffff",
      secondaryPadding: "28px 28px 32px",
      secondaryRadius: "24px",
      includeSuggestions: false,
      extraCss: `
        body.theme-sleek-vanguard .resume {
          border: 1px solid rgba(2,132,199,0.12);
        }
        body.theme-sleek-vanguard .resume-header {
          border-bottom: 1px solid rgba(2,132,199,0.14);
        }
      `,
    },
  },
  {
    id: "leadership-aura",
    name: "Leadership Aura",
    description: "Bold left-sidebar design with vivid leadership branding.",
    preview: "/resume-templates/template-03.jpg",
    theme: {
      layout: "sidebar-left",
      accentColor: "#BE185D",
      subtitleColor: "#BE185D",
      secondaryBackground: "linear-gradient(180deg, rgba(190,24,93,0.14), rgba(190,24,93,0.05))",
      secondaryPadding: "48px 32px",
      secondaryRadius: "0 32px 32px 0",
      contactPlacement: "both",
      skillsLayout: "pill",
      includeSuggestions: true,
      extraCss: `
        body.theme-leadership-aura .resume::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 12px;
          height: 100%;
          background: linear-gradient(180deg, #F472B6, #BE185D);
        }
        body.theme-leadership-aura .resume {
          position: relative;
        }
      `,
    },
  },
  {
    id: "product-vision",
    name: "Product Vision",
    description: "Single-column narrative with hero summary and spotlight wins.",
    preview: "/resume-templates/template-04.jpg",
    theme: {
      layout: "single",
      accentColor: "#7C3AED",
      subtitleColor: "#5B21B6",
      summaryPlacement: "hero",
      skillsLayout: "grid",
      experienceVariant: "bordered",
      includeSuggestions: false,
      headerBackground:
        "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.08))",
      heroSummaryBackground: "rgba(124,58,237,0.10)",
      heroSummaryBorder: "1px solid rgba(124,58,237,0.2)",
      heroSummaryRadius: "18px",
      heroSummaryPadding: "18px 22px",
      contactPlacement: "secondary",
    },
  },
  {
    id: "growth-impact",
    name: "Growth Impact",
    description: "Timeline experience with performance callouts and growth metrics.",
    preview: "/resume-templates/template-05.jpg",
    theme: {
      accentColor: "#16A34A",
      subtitleColor: "#166534",
      experienceVariant: "timeline",
      skillsPlacement: "primary",
      includeSuggestions: true,
      secondaryBackground: "rgba(22,101,52,0.06)",
      secondaryPadding: "28px 28px 32px",
    },
  },
  {
    id: "enterprise-lattice",
    name: "Enterprise Lattice",
    description: "Dark enterprise aesthetic with luminous accents and split focus.",
    preview: "/resume-templates/template-06.jpg",
    theme: {
      backgroundColor: "#0B1120",
      cardBackground: "#0F172A",
      textColor: "#E2E8F0",
      mutedColor: "#94A3B8",
      borderColor: "rgba(148,163,184,0.24)",
      headerBackground: "#111C32",
      headerTextColor: "#F8FAFC",
      accentColor: "#38BDF8",
      subtitleColor: "#38BDF8",
      secondaryBackground: "rgba(56,189,248,0.08)",
      secondaryTextColor: "#E2E8F0",
      secondaryPadding: "30px 30px 34px",
      skillsLayout: "tag",
      includeSuggestions: false,
      contactPlacement: "both",
      extraCss: `
        body.theme-enterprise-lattice {
          color: #E2E8F0;
        }
        body.theme-enterprise-lattice .resume {
          border: 1px solid rgba(148,163,184,0.24);
        }
      `,
    },
  },
  {
    id: "calibre",
    name: "Calibre",
    description: "Right-sidebar template highlighting quick stats and strengths.",
    preview: "/resume-templates/template-07.jpg",
    theme: {
      layout: "sidebar-right",
      accentColor: "#EA580C",
      subtitleColor: "#C2410C",
      secondaryBackground: "#FFF7ED",
      secondaryPadding: "36px 32px",
      secondaryRadius: "32px 0 0 32px",
      skillsLayout: "list",
      includeSuggestions: true,
      experienceVariant: "compact",
    },
  },
  {
    id: "northstar",
    name: "Northstar",
    description: "Centered masthead with trust-building typography and badges.",
    preview: "/resume-templates/template-08.jpg",
    theme: {
      accentColor: "#1E3A8A",
      subtitleColor: "#1D4ED8",
      headerAlignment: "center",
      summaryPlacement: "hero",
      heroSummaryBackground: "rgba(30,58,138,0.08)",
      heroSummaryColor: "#1E293B",
      skillsLayout: "pill",
      includeSuggestions: true,
      secondaryBackground: "rgba(30,64,175,0.05)",
      secondaryPadding: "28px 28px 32px",
      extraCss: `
        body.theme-northstar .resume-header {
          padding-top: 64px;
        }
        body.theme-northstar .resume-header::before {
          content: "";
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 64px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #1E3A8A, #4F46E5);
        }
      `,
    },
  },
  {
    id: "crescendo",
    name: "Crescendo",
    description: "Bold single-column resume with decisive dividers and hierarchy.",
    preview: "/resume-templates/template-09.jpg",
    theme: {
      layout: "single",
      accentColor: "#DC2626",
      subtitleColor: "#B91C1C",
      skillsLayout: "list",
      experienceVariant: "bordered",
      includeSuggestions: false,
      secondaryPadding: "0",
      contactPlacement: "secondary",
      extraCss: `
        body.theme-crescendo .resume-header {
          border-bottom: 3px solid #DC2626;
        }
      `,
    },
  },
  {
    id: "atlas",
    name: "Atlas Framework",
    description: "Executive-grade layout with glass cards and high-contrast inputs.",
    preview: "/resume-templates/template-10.png",
    theme: {
      accentColor: "#0284C7",
      subtitleColor: "#0C4A6E",
      secondaryBackground: "rgba(2,132,199,0.06)",
      secondaryPadding: "32px 32px 36px",
      secondaryRadius: "24px",
      includeSuggestions: true,
      contactPlacement: "both",
      extraCss: `
        body.theme-atlas .secondary-column {
          backdrop-filter: blur(18px);
        }
        body.theme-atlas .resume {
          border: 1px solid rgba(2,132,199,0.10);
        }
      `,
    },
  },
  {
    id: "lumen",
    name: "Lumen",
    description: "Clean single-column resume with confident serif accents.",
    preview: "/resume-templates/template-11.png",
    theme: {
      layout: "single",
      accentColor: "#F59E0B",
      subtitleColor: "#B45309",
      headingFont: "'Merriweather', 'Georgia', serif",
      fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
      experienceVariant: "minimal",
      skillsLayout: "grid",
      includeSuggestions: false,
      contactPlacement: "secondary",
    },
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Vibrant split layout showcasing achievements and AI summaries.",
    preview: "/resume-templates/template-12.png",
    theme: {
      accentColor: "#22D3EE",
      subtitleColor: "#0E7490",
      headerBackground:
        "linear-gradient(120deg, rgba(34,211,238,0.20), rgba(14,116,144,0.16))",
      secondaryBackground: "rgba(14,116,144,0.08)",
      secondaryPadding: "30px 28px 34px",
      includeSuggestions: true,
      skillsLayout: "pill",
      extraCss: `
        body.theme-momentum .resume-header::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(34,211,238,0.28), transparent 60%);
          pointer-events: none;
        }
      `,
    },
  },
  {
    id: "capital",
    name: "Capital Ledger",
    description: "Finance-forward left rail with quantified deliverables.",
    preview: "/resume-templates/template-13.png",
    theme: {
      layout: "sidebar-left",
      accentColor: "#B45309",
      subtitleColor: "#7C2D12",
      secondaryBackground: "#FFFBEB",
      secondaryPadding: "44px 30px",
      secondaryRadius: "0 28px 28px 0",
      skillsLayout: "bar",
      experienceVariant: "bordered",
      includeSuggestions: true,
      contactPlacement: "secondary",
      extraCss: `
        body.theme-capital .resume::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 10px;
          height: 100%;
          background: linear-gradient(180deg, #F59E0B, #B45309);
        }
        body.theme-capital .resume {
          position: relative;
        }
      `,
    },
  },
  {
    id: "ferro",
    name: "Ferro",
    description: "Industrial aesthetic with precision grid and understated palette.",
    preview: "/resume-templates/template-14.png",
    theme: {
      accentColor: "#475569",
      subtitleColor: "#1F2937",
      skillsLayout: "tag",
      experienceVariant: "compact",
      includeSuggestions: false,
      secondaryBackground: "rgba(71,85,105,0.05)",
      secondaryPadding: "28px 28px 32px",
      extraCss: `
        body.theme-ferro .resume {
          border: 1px solid rgba(71,85,105,0.20);
        }
        body.theme-ferro .resume-header {
          border-bottom: 1px solid rgba(71,85,105,0.18);
        }
      `,
    },
  },
  {
    id: "marquee",
    name: "Marquee",
    description: "Center-aligned signature masthead with portfolio-ready polish.",
    preview: "/resume-templates/template-15.png",
    theme: {
      layout: "single",
      accentColor: "#C026D3",
      subtitleColor: "#86198F",
      headerAlignment: "center",
      summaryPlacement: "hero",
      includeSuggestions: false,
      skillsLayout: "pill",
      contactPlacement: "secondary",
      heroSummaryBackground: "rgba(192,38,211,0.10)",
      heroSummaryBorder: "1px solid rgba(192,38,211,0.18)",
      heroSummaryRadius: "20px",
      heroSummaryPadding: "20px 24px",
      extraCss: `
        body.theme-marquee .resume-header::after {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #DB2777, #C026D3, #7C3AED);
        }
      `,
    },
  },
  {
    id: "panorama",
    name: "Panorama",
    description: "Wide-aspect resume balancing quantitative and story-driven sections.",
    preview: "/resume-templates/template-16.png",
    theme: {
      maxWidth: "980px",
      accentColor: "#0EA5E9",
      subtitleColor: "#0369A1",
      skillsPlacement: "primary",
      educationPlacement: "primary",
      includeSuggestions: true,
      secondaryBackground: "rgba(14,165,233,0.05)",
      secondaryPadding: "30px 30px 36px",
      extraCss: `
        body.theme-panorama .primary-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
      `,
    },
  },
  {
    id: "halo",
    name: "Halo",
    description: "Right-aligned insights column with teal accent framing.",
    preview: "/resume-templates/template-17.png",
    theme: {
      layout: "sidebar-right",
      backgroundColor: "#ECFEFF",
      accentColor: "#14B8A6",
      subtitleColor: "#0F766E",
      secondaryBackground: "rgba(20,184,166,0.08)",
      secondaryPadding: "36px 30px",
      skillsLayout: "grid",
      includeSuggestions: true,
      contactPlacement: "both",
      extraCss: `
        body.theme-halo .resume-header::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(20,184,166,0.25), transparent 60%);
          pointer-events: none;
        }
      `,
    },
  },
  {
    id: "equilibrium",
    name: "Equilibrium",
    description: "Balanced single-column layout with restrained gradients.",
    preview: "/resume-templates/template-18.png",
    theme: {
      layout: "single",
      accentColor: "#6366F1",
      subtitleColor: "#4338CA",
      maxWidth: "880px",
      skillsLayout: "grid",
      includeSuggestions: true,
      experienceVariant: "minimal",
      contactPlacement: "secondary",
      heroSummaryBackground: "rgba(99,102,241,0.08)",
      heroSummaryBorder: "1px solid rgba(99,102,241,0.18)",
      heroSummaryRadius: "18px",
    },
  },
  {
    id: "framework",
    name: "Framework",
    description: "Structured resume with metrics rail and modular blocks.",
    preview: "/resume-templates/template-19.png",
    theme: {
      accentColor: "#2563EB",
      subtitleColor: "#1D4ED8",
      secondaryBackground: "rgba(37,99,235,0.06)",
      secondaryPadding: "30px 30px 34px",
      skillsLayout: "tag",
      includeSuggestions: true,
      extraCss: `
        body.theme-framework .resume-header {
          border-bottom: 2px solid rgba(37,99,235,0.2);
        }
        body.theme-framework .secondary-column::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          border: 1px solid rgba(37,99,235,0.12);
        }
        body.theme-framework .secondary-column {
          position: relative;
        }
      `,
    },
  },
  {
    id: "catalyst",
    name: "Catalyst",
    description: "High-energy layout with signal red gradients and impact bullets.",
    preview: "/resume-templates/template-20.png",
    theme: {
      accentColor: "#EF4444",
      subtitleColor: "#B91C1C",
      headerBackground: "#111827",
      headerTextColor: "#F8FAFC",
      skillsLayout: "bar",
      includeSuggestions: false,
      secondaryBackground: "rgba(239,68,68,0.08)",
      secondaryPadding: "30px 28px",
      contactPlacement: "both",
      extraCss: `
        body.theme-catalyst .resume {
          border: 1px solid rgba(239,68,68,0.15);
        }
      `,
    },
  },
  {
    id: "nocturne",
    name: "Nocturne",
    description: "Midnight palette with luminous typography for senior creatives.",
    preview: "/resume-templates/template-21.svg",
    theme: {
      layout: "single",
      backgroundColor: "#0F172A",
      cardBackground: "#111827",
      textColor: "#E2E8F0",
      mutedColor: "#94A3B8",
      borderColor: "rgba(71,85,105,0.45)",
      headerBackground: "#0F172A",
      headerTextColor: "#F8FAFC",
      accentColor: "#38BDF8",
      subtitleColor: "#38BDF8",
      skillsLayout: "tag",
      includeSuggestions: true,
      summaryPlacement: "hero",
      contactPlacement: "both",
      heroSummaryBackground: "rgba(15,23,42,0.75)",
      heroSummaryColor: "#F8FAFC",
      heroSummaryBorder: "1px solid rgba(56,189,248,0.20)",
      heroSummaryRadius: "20px",
      heroSummaryPadding: "20px 22px",
    },
  },
  {
    id: "skyline",
    name: "Skyline",
    description: "Aerial-inspired template with elevated headline and columns.",
    preview: "/resume-templates/template-22.svg",
    theme: {
      accentColor: "#0284C7",
      subtitleColor: "#0369A1",
      headerAlignment: "center",
      summaryPlacement: "header",
      skillsLayout: "grid",
      includeSuggestions: false,
      secondaryBackground: "rgba(2,132,199,0.06)",
      secondaryPadding: "30px 28px",
      extraCss: `
        body.theme-skyline .resume-header {
          padding-top: 70px;
        }
        body.theme-skyline .resume-header::before {
          content: "";
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 3px;
          background: linear-gradient(90deg, #0EA5E9, #38BDF8);
          border-radius: 999px;
        }
      `,
    },
  },
  {
    id: "heritage",
    name: "Heritage",
    description: "Classical serif composition with refined line work.",
    preview: "/resume-templates/template-23.svg",
    theme: {
      layout: "single",
      fontFamily: "'Libre Baskerville', 'Georgia', serif",
      headingFont: "'Playfair Display', 'Georgia', serif",
      accentColor: "#B45309",
      subtitleColor: "#7C2D12",
      headerBackground: "#F4F1E8",
      cardBackground: "#FFFFFF",
      textColor: "#1F2937",
      mutedColor: "#4B5563",
      skillsLayout: "list",
      includeSuggestions: false,
      heroSummaryBackground: "rgba(244,241,232,0.8)",
      heroSummaryBorder: "1px solid rgba(180,83,9,0.25)",
      contactPlacement: "secondary",
    },
  },
  {
    id: "midnight",
    name: "Midnight Arc",
    description: "Gradient left rail with glowing accent chips and timeline flow.",
    preview: "/resume-templates/template-24.svg",
    theme: {
      layout: "sidebar-left",
      backgroundColor: "#0B1120",
      cardBackground: "#0F172A",
      textColor: "#E2E8F0",
      mutedColor: "#94A3B8",
      borderColor: "rgba(59,130,246,0.28)",
      accentColor: "#22D3EE",
      subtitleColor: "#22D3EE",
      secondaryBackground: "rgba(34,211,238,0.14)",
      secondaryTextColor: "#F8FAFC",
      secondaryPadding: "50px 30px",
      secondaryRadius: "0 28px 28px 0",
      skillsLayout: "pill",
      experienceVariant: "timeline",
      includeSuggestions: true,
      contactPlacement: "both",
      extraCss: `
        body.theme-midnight .resume::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 100%;
          background: linear-gradient(180deg, #22D3EE, rgba(34,211,238,0.2));
        }
        body.theme-midnight .resume {
          position: relative;
          border: 1px solid rgba(34,211,238,0.18);
        }
      `,
    },
  },
  {
    id: "tidal",
    name: "Tidal",
    description: "Coastal palette with balanced columns and pill skills.",
    preview: "/resume-templates/template-25.svg",
    theme: {
      accentColor: "#0E7490",
      subtitleColor: "#155E75",
      backgroundColor: "#F0FDFA",
      cardBackground: "#FFFFFF",
      skillsLayout: "grid",
      includeSuggestions: true,
      secondaryBackground: "rgba(14,116,144,0.06)",
      secondaryPadding: "32px 30px 36px",
      educationPlacement: "primary",
      extraCss: `
        body.theme-tidal .resume-header::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(14,116,144,0.18), transparent 60%);
          pointer-events: none;
        }
      `,
    },
  },
];

const defaultTemplateId = "modern";

const htmlEscapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const htmlEscapeRegex = /[&<>"']/g;

function escapeHtml(value) {
  if (value == null) {
    return "";
  }
  const stringValue = String(value);
  return stringValue.replace(htmlEscapeRegex, (char) => htmlEscapeMap[char]);
}

function normalizeList(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) =>
        typeof entry === "string" ? entry.trim() : entry != null ? String(entry).trim() : "",
      )
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n\r•,;|]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeResume(data = {}) {
  const personalInfo =
    data.personalInfo && typeof data.personalInfo === "object" ? { ...data.personalInfo } : {};

  const experience = Array.isArray(data.experience)
    ? data.experience
        .filter(Boolean)
        .map((item) => {
          if (!item || typeof item !== "object") {
            return {
              title: typeof item === "string" ? item : "",
              company: "",
              location: "",
              start: "",
              end: "",
              highlights: [],
            };
          }
          return {
            ...item,
            highlights: normalizeList(item.highlights ?? item.points ?? item.bullets),
            summary:
              typeof item.summary === "string" ? item.summary.trim() : item.summary ?? "",
          };
        })
    : [];

  const education = Array.isArray(data.education)
    ? data.education
        .filter(Boolean)
        .map((item) => {
          if (!item || typeof item !== "object") {
            return {
              institution: typeof item === "string" ? item : "",
              degree: "",
              graduation: "",
            };
          }
          return {
            ...item,
            highlights: normalizeList(item.highlights),
          };
        })
    : [];

  const skills =
    Array.isArray(data.skills) && data.skills.length
      ? data.skills.flatMap((value) => (Array.isArray(value) ? normalizeList(value) : [value]))
      : normalizeList(data.skills);

  const normalizedSkills = normalizeList(skills);
  const suggestions = normalizeList(data.suggestions);

  return {
    personalInfo,
    experience,
    education,
    skills: normalizedSkills,
    suggestions,
  };
}

function formatDateRange(start, end) {
  const startText = typeof start === "string" ? start.trim() : "";
  const endText = typeof end === "string" ? end.trim() : "";
  if (!startText && !endText) {
    return "";
  }
  if (startText && endText) {
    if (startText === endText) {
      return startText;
    }
    return `${startText} – ${endText}`;
  }
  return startText || endText || "";
}

function renderInline(parts, separatorClass = "separator", separatorSymbol = "·") {
  const cleaned = parts
    .map((value) => (typeof value === "string" ? value.trim() : value != null ? String(value) : ""))
    .filter(Boolean);
  if (!cleaned.length) {
    return "";
  }
  const safeSeparator = escapeHtml(separatorSymbol);
  return cleaned
    .map((value, index) => {
      const safeValue = escapeHtml(value);
      if (index === 0) {
        return `<span>${safeValue}</span>`;
      }
      return `<span class="${separatorClass}">${safeSeparator}</span><span>${safeValue}</span>`;
    })
    .join("");
}

function buildSummary(personalInfo, labels) {
  const summaryText =
    personalInfo && typeof personalInfo.summary === "string"
      ? personalInfo.summary.trim()
      : "";
  if (!summaryText) {
    return { section: "", hero: "" };
  }
  const safeSummary = escapeHtml(summaryText);
  return {
    section: `<section class="section summary"><h2 class="section-title">${labels.summary}</h2><p>${safeSummary}</p></section>`,
    hero: `<div class="summary-hero">${safeSummary}</div>`,
  };
}

function buildExperience(experience, labels, theme) {
  if (!experience.length) {
    return "";
  }
  const variantClass = theme.experienceVariant ? ` ${theme.experienceVariant}` : "";

  const itemsHtml = experience
    .map((item) => {
      const roleParts = [];
      if (item.title) {
        roleParts.push(`<span class="role">${escapeHtml(item.title)}</span>`);
      }
      if (item.company) {
        roleParts.push(`<span class="company">${escapeHtml(item.company)}</span>`);
      }
      const roleLine = roleParts.length
        ? roleParts.join('<span class="dot"> · </span>')
        : "";

      const metaParts = [];
      const range = formatDateRange(item.start, item.end);
      if (range) {
        metaParts.push(range);
      }
      if (item.location) {
        metaParts.push(item.location);
      }
      if (item.employmentType) {
        metaParts.push(item.employmentType);
      }

      const metaLine = renderInline(metaParts, "meta-separator", "•");

      const summaryParagraph =
        typeof item.summary === "string" && item.summary.trim()
          ? `<p>${escapeHtml(item.summary.trim())}</p>`
          : "";

      const highlights = Array.isArray(item.highlights) ? item.highlights : [];
      const highlightList = highlights.length
        ? `<ul>${highlights.map((hl) => `<li>${escapeHtml(hl)}</li>`).join("")}</ul>`
        : "";

      return `<article class="experience-item">
        ${roleLine ? `<h3>${roleLine}</h3>` : ""}
        ${metaLine ? `<p class="meta">${metaLine}</p>` : ""}
        ${summaryParagraph}
        ${highlightList}
      </article>`;
    })
    .join("");

  return `<section class="section experience${variantClass}">
    <h2 class="section-title">${labels.experience}</h2>
    ${itemsHtml}
  </section>`;
}

function buildEducation(education, labels) {
  if (!education.length) {
    return "";
  }

  const items = education
    .map((item) => {
      const heading = renderInline(
        [item.degree, item.institution],
        "education-separator",
        "·",
      );
      const meta = renderInline([item.graduation, item.location], "education-meta", "•");
      const highlightList = Array.isArray(item.highlights) && item.highlights.length
        ? `<ul>${item.highlights.map((hl) => `<li>${escapeHtml(hl)}</li>`).join("")}</ul>`
        : "";
      return `<article class="education-item">
        ${heading ? `<h3>${heading}</h3>` : ""}
        ${meta ? `<p class="meta">${meta}</p>` : ""}
        ${highlightList}
      </article>`;
    })
    .join("");

  return `<section class="section education">
    <h2 class="section-title">${labels.education}</h2>
    ${items}
  </section>`;
}

function buildSkills(skills, labels, theme) {
  if (!skills.length) {
    return "";
  }
  const layoutClass = theme.skillsLayout ?? "pill";
  const items = skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
  return `<section class="section skills">
    <h2 class="section-title">${labels.skills}</h2>
    <ul class="skills-list ${layoutClass}">
      ${items}
    </ul>
  </section>`;
}

function buildInsights(suggestions, labels) {
  if (!suggestions.length) {
    return "";
  }
  const items = suggestions.map((note) => `<li>${escapeHtml(note)}</li>`).join("");
  return `<section class="section insights">
    <h2 class="section-title">${labels.insights}</h2>
    <ul class="insight-list">${items}</ul>
  </section>`;
}

function buildContact(personalInfo, labels, theme) {
  const values = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website ?? personalInfo.url,
    personalInfo.linkedin,
    personalInfo.portfolio,
    personalInfo.github,
  ]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

  if (!values.length) {
    return { line: "", block: "", hasContact: false };
  }

  const contactLine = `<p class="contact-line">${renderInline(
    values,
    "contact-separator",
    theme.contactSeparator ?? "•",
  )}</p>`;

  const blockItems = values.map((value) => `<li>${escapeHtml(value)}</li>`).join("");
  const block = `<section class="section contact">
    <h2 class="section-title">${labels.contact}</h2>
    <ul class="contact-list">${blockItems}</ul>
  </section>`;

  return {
    line: contactLine,
    block,
    hasContact: true,
  };
}

function getBulletCss(theme, accentColor) {
  const bulletStyle = theme.bulletStyle ?? "disc";
  if (bulletStyle === "square") {
    return `
      .experience-item ul { list-style-type: square; }
    `;
  }
  if (bulletStyle === "dash") {
    return `
      .experience-item ul { list-style: none; padding-left: 0; }
      .experience-item ul li {
        position: relative;
        padding-left: 20px;
      }
      .experience-item ul li::before {
        content: "—";
        position: absolute;
        left: 0;
        color: ${accentColor};
        font-weight: 600;
      }
    `;
  }
  if (bulletStyle === "check") {
    return `
      .experience-item ul { list-style: none; padding-left: 0; }
      .experience-item ul li {
        position: relative;
        padding-left: 24px;
      }
      .experience-item ul li::before {
        content: "✔";
        position: absolute;
        left: 0;
        color: ${accentColor};
        font-size: 0.85em;
        top: 0.15em;
      }
    `;
  }
  return "";
}

function getSkillsCss(theme, accentColor, skillPillBackground, skillPillBorder, skillPillColor, skillPillPadding, skillPillRadius, skillFontSize, textColor) {
  const layout = theme.skillsLayout ?? "pill";
  if (layout === "grid") {
    return `
      .skills-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }
      .skills-list li {
        background: ${skillPillBackground};
        border: ${skillPillBorder};
        color: ${skillPillColor};
        padding: 14px 16px;
        border-radius: 16px;
        font-weight: 600;
        text-align: center;
        font-size: ${skillFontSize};
      }
    `;
  }
  if (layout === "list") {
    return `
      .skills-list {
        margin: 0;
        padding-left: 20px;
        display: block;
        list-style-type: disc;
      }
      .skills-list li {
        margin-bottom: 8px;
        color: ${textColor};
      }
    `;
  }
  if (layout === "tag") {
    return `
      .skills-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .skills-list li {
        border: 1px solid ${skillPillColor};
        color: ${skillPillColor};
        padding: 6px 12px;
        border-radius: 10px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.08em;
        background: rgba(255,255,255,0.02);
      }
    `;
  }
  if (layout === "bar") {
    return `
      .skills-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .skills-list li {
        background: linear-gradient(90deg, ${skillPillColor}, ${skillPillColor}33);
        color: ${textColor};
        padding: 12px 18px;
        border-radius: 14px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }
    `;
  }
  return `
    .skills-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .skills-list li {
      background: ${skillPillBackground};
      border: ${skillPillBorder};
      color: ${skillPillColor};
      padding: ${skillPillPadding};
      border-radius: ${skillPillRadius};
      font-weight: 600;
      font-size: ${skillFontSize};
    }
  `;
}

function getLayoutCss(theme) {
  const layout = theme.layout ?? "two-column";
  const columnGap = theme.columnGap ?? "40px";
  const stackGap = theme.stackGap ?? "32px";
  const primaryRatio = theme.primaryRatio ?? "2.2fr";
  const secondaryRatio = theme.secondaryRatio ?? "1fr";

  if (layout === "two-column") {
    return `
      .layout-two-column .resume-body.has-secondary {
        display: grid;
        grid-template-columns: minmax(0, ${primaryRatio}) minmax(0, ${secondaryRatio});
        gap: ${columnGap};
      }
      .layout-two-column .resume-body.single-track {
        display: flex;
        flex-direction: column;
        gap: ${stackGap};
      }
    `;
  }
  if (layout === "sidebar-left") {
    return `
      .layout-sidebar-left .resume-body.has-secondary {
        display: grid;
        grid-template-columns: minmax(0, ${secondaryRatio}) minmax(0, ${primaryRatio});
        gap: ${columnGap};
      }
      .layout-sidebar-left .resume-body.single-track {
        display: flex;
        flex-direction: column;
        gap: ${stackGap};
      }
      .layout-sidebar-left .secondary-column {
        order: -1;
      }
    `;
  }
  if (layout === "sidebar-right") {
    return `
      .layout-sidebar-right .resume-body.has-secondary {
        display: grid;
        grid-template-columns: minmax(0, ${primaryRatio}) minmax(0, ${secondaryRatio});
        gap: ${columnGap};
      }
      .layout-sidebar-right .resume-body.single-track {
        display: flex;
        flex-direction: column;
        gap: ${stackGap};
      }
    `;
  }
  return `
    .layout-single .resume-body {
      display: flex;
      flex-direction: column;
      gap: ${stackGap};
    }
  `;
}

function getExperienceCss(theme, accentColor, cardBackground, borderColor) {
  const variant = theme.experienceVariant ?? "standard";
  if (variant === "compact") {
    return `
      .experience.compact .experience-item {
        padding-bottom: 18px;
      }
      .experience.compact .experience-item:not(:last-child) {
        margin-bottom: 18px;
        border-bottom: 1px dashed ${borderColor};
      }
    `;
  }
  if (variant === "minimal") {
    return `
      .experience.minimal .experience-item {
        padding-bottom: 16px;
      }
      .experience.minimal .experience-item:not(:last-child) {
        margin-bottom: 16px;
        border-bottom: none;
      }
      .experience.minimal .experience-item ul {
        margin-top: 10px;
      }
    `;
  }
  if (variant === "timeline") {
    return `
      .experience.timeline {
        position: relative;
        padding-left: 12px;
      }
      .experience.timeline::before {
        content: "";
        position: absolute;
        left: 28px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background: ${accentColor};
      }
      .experience.timeline .experience-item {
        position: relative;
        margin-left: 24px;
        padding-left: 28px;
        border-bottom: none;
        padding-bottom: 24px;
      }
      .experience.timeline .experience-item::before {
        content: "";
        position: absolute;
        left: -16px;
        top: 10px;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        border: 3px solid ${accentColor};
        background: ${cardBackground};
      }
      .experience.timeline .experience-item:not(:last-child) {
        margin-bottom: 24px;
      }
    `;
  }
  if (variant === "bordered") {
    return `
      .experience.bordered {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .experience.bordered .experience-item {
        border: 1px solid ${borderColor};
        border-radius: 18px;
        padding: 20px 24px;
        margin: 0;
      }
      .experience.bordered .experience-item:not(:last-child) {
        border-bottom: none;
        margin-bottom: 0;
      }
      .experience.bordered .experience-item ul {
        margin-top: 14px;
      }
    `;
  }
  return "";
}

function buildCss(theme) {
  const fontFamily = theme.fontFamily ?? "'Inter', 'Segoe UI', sans-serif";
  const headingFont = theme.headingFont ?? fontFamily;
  const backgroundColor = theme.backgroundColor ?? "#F8FAFC";
  const cardBackground = theme.cardBackground ?? "#ffffff";
  const accentColor = theme.accentColor ?? "#1D4ED8";
  const accentTextColor = theme.accentTextColor ?? "#ffffff";
  const textColor = theme.textColor ?? "#0f172a";
  const mutedColor = theme.mutedColor ?? "#475569";
  const borderColor = theme.borderColor ?? "#E2E8F0";
  const headerBackground = theme.headerBackground ?? cardBackground;
  const headerTextColor = theme.headerTextColor ?? textColor;
  const borderRadius = theme.borderRadius ?? "28px";
  const shadow = theme.shadow ?? "0 40px 80px rgba(15, 23, 42, 0.12)";
  const headingTransform = theme.headingTransform ?? "uppercase";
  const headingLetterSpacing = theme.headingLetterSpacing ?? "0.18em";
  const headingSize = theme.headingSize ?? "13px";
  const pagePadding = theme.pagePadding ?? "56px 48px";
  const bodyPadding = theme.bodyPadding ?? "48px 56px 56px";
  const headerPadding = theme.headerPadding ?? "52px 56px 40px";
  const sectionSpacing = theme.sectionSpacing ?? "36px";
  const experienceSpacing = theme.experienceSpacing ?? "28px";
  const skillsLayout = theme.skillsLayout ?? "pill";
  const layout = theme.layout ?? "two-column";
  const maxWidth = theme.maxWidth ?? "960px";
  const nameSize = theme.nameSize ?? "38px";
  const nameWeight = theme.nameWeight ?? 700;
  const nameLetterSpacing = theme.nameLetterSpacing ?? "-0.02em";
  const nameSpacing = theme.nameSpacing ?? "8px";
  const titleSize = theme.titleSize ?? "18px";
  const titleWeight = theme.titleWeight ?? 600;
  const titleTransform = theme.titleTransform ?? "uppercase";
  const titleLetterSpacing = theme.titleLetterSpacing ?? "0.14em";
  const subtitleColor = theme.subtitleColor ?? accentColor;
  const contactColor = theme.contactColor ?? mutedColor;
  const contactSize = theme.contactSize ?? "14px";
  const contactDividerColor = theme.contactDividerColor ?? borderColor;
  const heroSummarySize = theme.heroSummarySize ?? "17px";
  const heroSummaryColor = theme.heroSummaryColor ?? mutedColor;
  const heroSummaryBackground = theme.heroSummaryBackground ?? "transparent";
  const heroSummaryPadding = theme.heroSummaryPadding ?? "16px 20px";
  const heroSummaryBorder = theme.heroSummaryBorder ?? "none";
  const heroSummaryRadius = theme.heroSummaryRadius ?? "18px";
  const headingColor = theme.headingColor ?? accentColor;
  const headingWeight = theme.headingWeight ?? 700;
  const headingSpacing = theme.headingSpacing ?? "16px";
  const bodyFontSize = theme.bodyFontSize ?? "15px";
  const bodyLineHeight = theme.bodyLineHeight ?? "1.7";
  const bodyParagraphSpacing = theme.bodyParagraphSpacing ?? "14px";
  const experienceTitleSize = theme.experienceTitleSize ?? "18px";
  const experienceTitleWeight = theme.experienceTitleWeight ?? 600;
  const experienceTitleLetterSpacing = theme.experienceTitleLetterSpacing ?? "-0.01em";
  const metaSize = theme.metaSize ?? "12px";
  const metaTransform = theme.metaTransform ?? "uppercase";
  const metaLetterSpacing = theme.metaLetterSpacing ?? "0.12em";
  const metaColor = theme.metaColor ?? mutedColor;
  const metaSpacing = theme.metaSpacing ?? "12px";
  const bulletSpacing = theme.bulletSpacing ?? "10px";
  const skillPillBackground =
    theme.skillPillBackground ?? `rgba(${parseInt(accentColor.slice(1, 3), 16)}, ${parseInt(
      accentColor.slice(3, 5),
      16,
    )}, ${parseInt(accentColor.slice(5, 7), 16)}, 0.08)`;
  const skillPillBorder = theme.skillPillBorder ?? "transparent";
  const skillPillColor = theme.skillPillColor ?? accentColor;
  const skillPillPadding = theme.skillPillPadding ?? "8px 14px";
  const skillPillRadius = theme.skillPillRadius ?? "999px";
  const skillFontSize = theme.skillFontSize ?? "13px";
  const insightBackground = theme.insightBackground ?? `rgba(29,78,216,0.07)`;
  const insightBorder = theme.insightBorder ?? `1px solid rgba(29,78,216,0.12)`;
  const insightColor = theme.insightColor ?? textColor;
  const primaryBackground = theme.primaryBackground ?? "transparent";
  const primaryPadding = theme.primaryPadding ?? "0";
  const primaryRadius = theme.primaryRadius ?? "0";
  const secondaryBackground = theme.secondaryBackground ?? "transparent";
  const secondaryPadding = theme.secondaryPadding ?? "0";
  const secondaryRadius = theme.secondaryRadius ?? "0";
  const secondaryTextColor = theme.secondaryTextColor ?? textColor;
  const extraCss = theme.extraCss ?? "";
  const headerAlignment = theme.headerAlignment ?? "left";

  const bulletCss = getBulletCss(theme, accentColor);
  const skillsCss = getSkillsCss(
    theme,
    accentColor,
    skillPillBackground,
    skillPillBorder,
    skillPillColor,
    skillPillPadding,
    skillPillRadius,
    skillFontSize,
    textColor,
  );
  const layoutCss = getLayoutCss(theme);
  const experienceCss = getExperienceCss(theme, accentColor, cardBackground, borderColor);

  return `
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: ${pagePadding};
      background: ${backgroundColor};
      color: ${textColor};
      font-family: ${fontFamily};
      font-size: 16px;
      line-height: 1.5;
    }
    .resume {
      margin: 0 auto;
      max-width: ${maxWidth};
      background: ${cardBackground};
      color: ${textColor};
      border-radius: ${borderRadius};
      box-shadow: ${shadow};
      overflow: hidden;
      position: relative;
    }
    .resume-header {
      background: ${headerBackground};
      color: ${headerTextColor};
      padding: ${headerPadding};
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: ${headerAlignment === "center" ? "center" : "left"};
      align-items: ${headerAlignment === "center" ? "center" : "flex-start"};
    }
    .resume-header .headline h1 {
      font-family: ${headingFont};
      font-size: ${nameSize};
      font-weight: ${nameWeight};
      letter-spacing: ${nameLetterSpacing};
      margin: 0 0 ${nameSpacing} 0;
    }
    .resume-header .headline .subtitle {
      margin: 0;
      font-size: ${titleSize};
      font-weight: ${titleWeight};
      text-transform: ${titleTransform};
      letter-spacing: ${titleLetterSpacing};
      color: ${subtitleColor};
    }
    .summary-hero {
      margin-top: 12px;
      font-size: ${heroSummarySize};
      line-height: 1.7;
      color: ${heroSummaryColor};
      background: ${heroSummaryBackground};
      padding: ${heroSummaryPadding};
      border: ${heroSummaryBorder};
      border-radius: ${heroSummaryRadius};
    }
    .contact-line {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      font-size: ${contactSize};
      color: ${contactColor};
    }
    .contact-line .contact-separator {
      color: ${contactDividerColor};
      opacity: 0.55;
      padding: 0 4px;
    }
    .resume-body {
      padding: ${bodyPadding};
    }
    .resume-body .primary-column {
      background: ${primaryBackground};
      padding: ${primaryPadding};
      border-radius: ${primaryRadius};
    }
    .resume-body .secondary-column {
      background: ${secondaryBackground};
      padding: ${secondaryPadding};
      border-radius: ${secondaryRadius};
      color: ${secondaryTextColor};
    }
    .resume-body .secondary-column:empty {
      display: none;
    }
    .section {
      margin-bottom: ${sectionSpacing};
    }
    .section:last-child {
      margin-bottom: 0;
    }
    .section-title {
      font-family: ${headingFont};
      font-weight: ${headingWeight};
      font-size: ${headingSize};
      text-transform: ${headingTransform};
      letter-spacing: ${headingLetterSpacing};
      color: ${headingColor};
      margin-bottom: ${headingSpacing};
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::after {
      content: "";
      display: inline-block;
      height: 1px;
      width: 32px;
      background: ${headingColor};
      opacity: 0.25;
    }
    .section p {
      font-size: ${bodyFontSize};
      line-height: ${bodyLineHeight};
      color: ${mutedColor};
      margin-bottom: ${bodyParagraphSpacing};
    }
    .section p:last-child {
      margin-bottom: 0;
    }
    .experience-item {
      padding-bottom: ${experienceSpacing};
    }
    .experience-item:not(:last-child) {
      margin-bottom: ${experienceSpacing};
      border-bottom: 1px solid ${borderColor};
    }
    .experience-item h3 {
      font-size: ${experienceTitleSize};
      font-weight: ${experienceTitleWeight};
      letter-spacing: ${experienceTitleLetterSpacing};
      margin: 0 0 8px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .experience-item h3 .company {
      color: ${mutedColor};
      font-weight: 600;
    }
    .experience-item .meta {
      font-size: ${metaSize};
      text-transform: ${metaTransform};
      letter-spacing: ${metaLetterSpacing};
      color: ${metaColor};
      margin-bottom: ${metaSpacing};
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
    }
    .experience-item ul {
      margin-top: 14px;
      padding-left: 22px;
      color: ${mutedColor};
    }
    .experience-item ul li {
      margin-bottom: ${bulletSpacing};
    }
    .experience-item ul li:last-child {
      margin-bottom: 0;
    }
    .education-item {
      margin-bottom: 18px;
    }
    .education-item:last-child {
      margin-bottom: 0;
    }
    .education-item h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: ${textColor};
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .education-item .meta {
      font-size: ${metaSize};
      text-transform: ${metaTransform};
      letter-spacing: ${metaLetterSpacing};
      color: ${metaColor};
    }
    .contact-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: ${bodyFontSize};
      color: ${mutedColor};
    }
    .insight-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .insight-list li {
      background: ${insightBackground};
      border: ${insightBorder};
      color: ${insightColor};
      padding: 14px 16px;
      border-radius: 16px;
      font-size: ${bodyFontSize};
      line-height: 1.6;
    }
    ${bulletCss}
    ${skillsCss}
    ${layoutCss}
    ${experienceCss}
    ${extraCss}
  `;
}

function createRenderer(definition) {
  const themeOverrides = definition.theme ?? {};
  const theme = {
    ...baseTheme,
    ...themeOverrides,
    labels: {
      ...baseTheme.labels,
      ...(themeOverrides.labels ?? {}),
    },
  };

  return (data = {}) => {
    const normalized = normalizeResume(data);
    const labels = theme.labels ?? baseTheme.labels;

    const { personalInfo, experience, education, skills, suggestions } = normalized;

    const name = personalInfo.fullName
      ? escapeHtml(personalInfo.fullName)
      : "Candidate Name";
    const titleLine = personalInfo.title ? escapeHtml(personalInfo.title) : "";

    const summaryBlocks = buildSummary(personalInfo, labels);
    const experienceSection = buildExperience(experience, labels, theme);
    const educationSection = buildEducation(education, labels);
    const skillsSection = buildSkills(skills, labels, theme);
    const insightsSection =
      theme.includeSuggestions && suggestions.length
        ? buildInsights(suggestions, labels)
        : "";

    const contactBlocks = buildContact(personalInfo, labels, theme);

    const placements = {
      summary: theme.summaryPlacement ?? "primary",
      education: theme.educationPlacement ?? "secondary",
      skills: theme.skillsPlacement ?? "secondary",
      suggestions: theme.suggestionsPlacement ?? "secondary",
      contact: theme.contactPlacement ?? "header",
    };

    const primaryParts = [];
    const secondaryParts = [];

    let headerSummary = "";

    if (summaryBlocks.section) {
      if (placements.summary === "primary") {
        primaryParts.push(summaryBlocks.section);
      } else if (placements.summary === "secondary") {
        secondaryParts.push(summaryBlocks.section);
      } else if (placements.summary === "header" || placements.summary === "hero") {
        headerSummary = summaryBlocks.hero;
      }
    }

    if (experienceSection) {
      primaryParts.push(experienceSection);
    }

    if (educationSection) {
      if (placements.education === "primary") {
        primaryParts.push(educationSection);
      } else {
        secondaryParts.push(educationSection);
      }
    }

    if (skillsSection) {
      if (placements.skills === "primary") {
        primaryParts.push(skillsSection);
      } else {
        secondaryParts.push(skillsSection);
      }
    }

    if (insightsSection) {
      if (placements.suggestions === "primary") {
        primaryParts.push(insightsSection);
      } else {
        secondaryParts.push(insightsSection);
      }
    }

    let contactLine = "";
    if (contactBlocks.hasContact) {
      const showHeader =
        theme.showHeaderContact === false
          ? false
          : placements.contact === "header" ||
            placements.contact === "both" ||
            (placements.contact === "secondary" && theme.showHeaderContact) ||
            (placements.contact === "primary" && theme.showHeaderContact);

      if (showHeader) {
        contactLine = contactBlocks.line;
      }

      if (placements.contact === "primary") {
        primaryParts.unshift(contactBlocks.block);
      }
      if (placements.contact === "secondary" || placements.contact === "both") {
        secondaryParts.unshift(contactBlocks.block);
      }
    }

    const primaryContent = primaryParts.filter(Boolean).join("");
    const secondaryContent = secondaryParts.filter(Boolean).join("");
    const hasSecondary = secondaryContent.trim().length > 0;

    const css = buildCss(theme);

    const bodyClasses = [
      `theme-${definition.id}`,
      `layout-${theme.layout ?? "two-column"}`,
    ].join(" ");

    const headerClasses = [
      "resume-header",
      theme.headerAlignment === "center" ? "center" : "left",
    ].join(" ");

    const resumeBodyClass = ["resume-body", hasSecondary ? "has-secondary" : "single-track"].join(
      " ",
    );

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${name} · Resume</title>
    <style>${css}</style>
  </head>
  <body class="${bodyClasses}">
    <div class="resume">
      <header class="${headerClasses}">
        <div class="headline">
          <h1>${name}</h1>
          ${titleLine ? `<p class="subtitle">${titleLine}</p>` : ""}
        </div>
        ${contactLine}
        ${headerSummary}
      </header>
      <div class="${resumeBodyClass}">
        <div class="primary-column">
          ${primaryContent}
        </div>
        ${hasSecondary ? `<aside class="secondary-column">${secondaryContent}</aside>` : ""}
      </div>
    </div>
  </body>
</html>`;
  };
}

const templateRenderers = new Map(
  templateDefinitions.map((definition) => [definition.id, createRenderer(definition)]),
);

export function renderResume(data, templateId = defaultTemplateId) {
  const renderer =
    templateRenderers.get(templateId) ?? templateRenderers.get(defaultTemplateId);
  return renderer(data);
}

export function listTemplates() {
  return templateDefinitions.map(({ id, name, description, preview, theme }) => ({
    id,
    name,
    description,
    preview,
    accentColor: theme.accentColor ?? baseTheme.accentColor,
    layout: theme.layout ?? baseTheme.layout,
  }));
}
