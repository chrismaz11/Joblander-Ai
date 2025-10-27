# Job-Lander Design Guidelines

## Design Approach


**Primary References**: 
- Notion (intuitive editing, preview modes)
- Linear (crisp typography, organized workflows)

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default):
- Background Base: 0 0% 7%
- Background Elevated: 0 0% 10%
- Background Interactive: 0 0% 14%
- Primary Brand: 250 95% 65% (vibrant purple-blue, trustworthy yet modern)
- Primary Hover: 250 95% 70%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%
- Text Muted: 0 0% 50%

**Light Mode**:
- Background Base: 0 0% 100%
- Background Elevated: 0 0% 97%
- Background Interactive: 0 0% 94%
- Primary Brand: 250 85% 55%
- Text Primary: 0 0% 10%
- Text Secondary: 0 0% 40%

**Accent Colors**:
- Success (blockchain verified): 142 76% 45%
- Warning (pending): 38 92% 50%
- Error: 0 84% 60%
- AI Highlight: 280 70% 65% (subtle purple for AI-generated content indicators)

### B. Typography

**Font Stack**:
- Primary: 'Inter', system-ui, sans-serif (body text, UI elements)
- Display: 'Cal Sans' or 'Satoshi', Inter (headings, hero text)

**Scale & Weights**:
- Hero Headline: text-6xl md:text-7xl, font-bold (64-72px)
- Section Headers: text-4xl md:text-5xl, font-bold
- Card Titles: text-xl font-semibold
- Body Text: text-base (16px), font-normal
- Labels/Meta: text-sm (14px), font-medium
- Captions: text-xs (12px), text-muted

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 consistently
- Component Padding: p-6 to p-8
- Section Spacing: py-20 md:py-32 (generous vertical rhythm)
- Card Gaps: gap-6 to gap-8
- Element Spacing: space-y-4 to space-y-6

**Grid System**:
- Landing Page: max-w-7xl mx-auto px-6
- App Pages: max-w-6xl mx-auto px-4
- Content: max-w-4xl for forms and text-heavy areas

**Container Strategy**:
- Full-width sections with inner max-width containers
- Consistent horizontal padding (px-4 md:px-6 lg:px-8)

---

## Page-Specific Guidelines


**Hero Section** (h-screen or min-h-[90vh]):
- Large hero image: Professional workspace scene with resume mockups (abstract, modern)
- Headline: "Land Your Dream Job with AI-Powered Precision"
- Subheadline: Supporting text about AI-generated resumes and cover letters
- Dual CTAs: Primary "Create Resume" + Secondary "View Templates"
- Floating trust indicators: "10,000+ Resumes Created" badge overlay

**Features Section** (3-column grid on desktop):
- AI Content Generation (icon + title + description)
- Blockchain Verification (unique differentiator)
Each card: p-8, rounded-2xl, hover:scale-105 transition

**How It Works** (4-step process):
- Horizontal timeline layout on desktop
- Each step: number badge + icon + title + description
- Connect steps with dotted lines

**Template Showcase**:
- Masonry grid or horizontal scroll carousel
- Template previews with hover zoom effect
- "50+ Professional Templates" headline

**Social Proof**:
- Testimonial cards (2-column)
- User avatar + quote + name + role + company
- Star ratings visualization

**CTA Section**:
- Gradient background (subtle primary brand tones)
- Large headline: "Ready to Transform Your Job Search?"
- Primary CTA button + secondary text link

**Footer**:
- 4-column grid: Product links, Resources, Company, Social
- Newsletter signup form
- Trust badges: "Blockchain Verified" + "AI Powered" icons

### Create Resume Page

**Layout**: 2-column split (50/50 on desktop, stack on mobile)
- Left: Multi-step form with progress indicator
- Right: Live preview panel (sticky position)

**Form Design**:
- Tab navigation: Personal Info → Experience → Education → Skills
- Input fields: rounded-lg, border focus:ring-2 ring-primary
- AI suggestions: Purple badge with sparkle icon "AI Suggested"
- Upload zone: Dashed border, drag-drop enabled, lg:h-48

**Preview Panel**:
- Resume preview at actual scale
- Floating controls: Download PDF, Save Draft, Verify

### Templates Page

**Template Gallery**:
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Template cards: aspect-video, hover:shadow-2xl transition
- Quick preview modal on click
- Filter tabs: All, Modern, Classic, Creative, Professional

**Template Card Design**:
- Template thumbnail image
- Template name + category badge
- "Preview" and "Use Template" buttons
- Popularity indicator (star count)

### Verify Page

**Verification Interface**:
- Center-focused card layout (max-w-2xl)
- Upload resume for verification
- Hash display with copy button
- Blockchain explorer link
- Status indicator: Pending → Verifying → Verified (with animations)

**Verification Success**:
- Large checkmark icon (success green)
- Transaction hash display
- Timestamp and network information
- Download certificate button

### Jobs Page

**Search Bar**: 
- Prominent top placement, max-w-4xl
- Job title + location dual inputs
- AI-powered search suggestions dropdown

**Job Listings**:
- Card-based layout with generous spacing
- Each card: Company logo + title + location + salary + description preview
- "AI Match Score" indicator (percentage with color gradient)
- Quick apply button

---

## Component Library

### Buttons
- Primary: bg-primary text-white, px-8 py-3, rounded-lg, font-semibold
- Secondary: variant="outline", border-2 border-primary
- Ghost: hover:bg-white/10
- Icon buttons: Square, rounded-lg, p-3

### Cards
- Base: bg-elevated, rounded-2xl, p-6 to p-8
- Hover: hover:shadow-xl, hover:-translate-y-1, transition-all
- Border: Subtle 1px border in border-white/10

### Forms
- Input: bg-interactive, border border-white/10, rounded-lg, px-4 py-3
- Focus state: ring-2 ring-primary ring-offset-2 ring-offset-background
- Label: font-medium, text-sm, mb-2

### Navigation
- Header: Sticky top-0, backdrop-blur-lg, bg-background/80
- Logo + Nav links (center) + CTA button (right)
- Mobile: Hamburger → full-screen overlay menu

### Modals & Overlays
- Backdrop: bg-black/60, backdrop-blur-sm
- Content: bg-elevated, rounded-2xl, max-w-2xl, p-8
- Close button: top-right, ghost button

### Progress Indicators
- Multi-step: Horizontal dots or numbered pills
- Loading: Spinner with AI sparkle animation
- Upload: Progress bar with percentage

---

## Animations

Use sparingly, focus on polish:
- Page transitions: Fade in with slide up (20px)
- Card hover: Scale 105% + shadow increase
- Button hover: Slight scale (102%) + brightness increase
- Blockchain verification: Pulse animation on success
- AI generation: Subtle shimmer effect on "Generating..." state

---

## Images

**Hero Section**: 
- Large background image: Modern professional workspace with laptop showing resume interface, subtle depth of field
- Placement: Full-width, behind hero content with dark overlay gradient

**Feature Icons**:
- AI Brain icon for content generation
- Shield with checkmark for blockchain verification

**Template Previews**:
- Professional resume mockups in various styles

**Social Proof**:
- User avatars (placeholder or stock professional headshots)
- Company logos where applicable