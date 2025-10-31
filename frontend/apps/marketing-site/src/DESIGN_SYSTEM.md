# JobLander SaaS Design System

## Overview
A comprehensive, production-ready SaaS web application design system for JobLander - an AI-powered job application management platform.

## Design Tokens

### Color Palette

#### Primary Colors
- **Brand Primary**: `#2563eb` (Blue 600)
- **Brand Primary Dark**: `#1d4ed8` (Blue 700)
- **Brand Primary Light**: `#3b82f6` (Blue 500)

#### Semantic Colors
- **Success**: `#10b981` (Green 500)
- **Warning**: `#f59e0b` (Amber 500)
- **Error**: `#ef4444` (Red 500)

#### Neutral Scale
- Light mode background: `#ffffff`
- Dark mode background: `#0f172a` (Slate 900)
- Border: `#e2e8f0` (light) / `#334155` (dark)

### Typography
- **Font Family**: System font stack (default)
- **Base Size**: 16px
- **Headings**: Medium weight (500)
- **Body**: Normal weight (400)

### Spacing & Layout
- **Border Radius**: `0.5rem` (8px base)
- **Container Max Width**: 1280px (7xl)
- **Sidebar Width**: 256px (64 collapsed)

## Component Library

### Pages & Templates

#### 1. Landing Page (`/components/LandingPage.tsx`)
- Hero section with value proposition
- Feature highlights grid (6 features)
- Pricing comparison table (3 tiers)
- Testimonials carousel
- Stats counter
- CTA sections
- Footer navigation

#### 2. Authentication
- **Login** (`/components/LoginPage.tsx`)
  - Email/password form
  - Social auth buttons (Google, GitHub)
  - Remember me checkbox
  - Password reset link
  - Split-screen layout with branding

- **Signup** (`/components/SignupPage.tsx`)
  - Full name, email, password fields
  - Terms acceptance checkbox
  - Social auth options
  - Benefits showcase sidebar

#### 3. Onboarding Flow (`/components/Onboarding.tsx`)
- 4-step wizard interface
- Progress indicator
- Step 1: Profile information
- Step 2: Job search goals
- Step 3: Preferences
- Step 4: Import data (LinkedIn, resume)
- Skip functionality

#### 4. Main Dashboard (`/components/Dashboard.tsx`)
- Stats overview cards (4 metrics)
- Usage alerts for subscription limits
- Application pipeline progress bars
- Recent applications list
- Upcoming interviews
- Quick action buttons
- AI resume generation CTA

#### 5. Job Board (`/components/JobBoard.tsx`)
- Kanban board layout
- 5 columns: Wishlist → Applied → Interview → Offer → Rejected
- Drag-and-drop functionality
- Job cards with company, position, location, salary
- Column counters
- Status badges

#### 6. Applications Hub (`/components/Applications.tsx`)
- Data table view
- Search and filter functionality
- Status dropdown filter
- Priority indicators (high/medium/low)
- Bulk actions
- Pagination
- Quick edit/delete actions
- Export functionality

#### 7. Job Details Page (`/components/JobDetails.tsx`)
- Back navigation
- Job header with status badges
- Status update buttons
- Tabbed interface:
  - Job details and description
  - Application timeline
  - Document management
  - Notes section
- Quick actions sidebar
- Contact information
- Reminder cards

#### 8. Interview Manager (`/components/InterviewManager.tsx`)
- Stats cards (upcoming, this week, completed)
- Calendar widget
- Upcoming/past interviews tabs
- Interview cards with:
  - Company and position
  - Date, time, type badges
  - Interviewer information
  - Preparation checklist
  - Notes section
- Interview prep guide
- Quick tips

#### 9. Resume Builder (`/components/ResumeBuilder.tsx`)
- Multi-step wizard (4 steps)
- Progress bar
- Step 1: Personal information
- Step 2: Work experience (dynamic add/remove)
- Step 3: Education (dynamic add/remove)
- Step 4: Skills and review
- Live preview pane
- AI enhancement suggestions
- Template selection
- Export options

#### 10. Analytics Dashboard (`/components/Analytics.tsx`)
- Key insights cards (4 metrics)
- Charts using Recharts:
  - Line chart: Application trends
  - Pie chart: Status distribution
  - Bar charts: Response rates, time-to-hire
- Skills in demand progress bars
- Application sources breakdown
- Goals progress tracking
- Exportable reports

#### 11. Billing & Subscription (`/components/Billing.tsx`)
- Current plan overview card
- Usage metrics and limits
- Plan comparison (monthly/yearly toggle)
- Payment methods management
- Invoice history
- Upgrade/downgrade flows
- Custom enterprise plan CTA
- Stripe-style payment forms

#### 12. Settings (`/components/Settings.tsx`)
- Tabbed interface:
  - Profile settings
  - Notification preferences
  - Application preferences
  - Security settings
- Avatar upload
- Email/push notification toggles
- Dark mode switch
- Password change form
- Two-factor authentication
- Active sessions management
- Danger zone (account deletion)

## SaaS-Specific Features

### Subscription Tiers
```typescript
Free:
  - 5 AI resume generations/month
  - Up to 10 active applications
  - Basic analytics
  - Email support

Professional ($19/month):
  - Unlimited AI resume generations
  - Unlimited applications
  - Advanced analytics
  - Interview prep tools
  - Priority support

Enterprise ($49/month):
  - Everything in Professional
  - Career coaching sessions
  - LinkedIn optimization
  - 24/7 support
  - Custom integrations
```

### Usage Limits & Indicators
- Visual progress bars for limits
- Warning alerts at 80% usage
- Upgrade prompts
- Feature gating based on tier

### Billing Features
- Monthly/yearly billing toggle
- Stripe integration patterns
- Invoice generation and download
- Payment method management
- Subscription cancellation flow

## UI Components

### Cards
- Default card with subtle shadow
- Gradient cards for premium features
- Colored border cards for alerts
- Glass morphism effects

### Buttons
- Primary (gradient for CTA)
- Secondary (outline)
- Ghost (minimal)
- Destructive (red)
- Sizes: sm, default, lg

### Forms
- Text inputs with validation states
- Select dropdowns
- Checkboxes and radio buttons
- Textareas
- File upload zones

### Data Display
- Tables with sorting/filtering
- Progress bars
- Badges and status indicators
- Stats cards with trends
- Timeline components

### Navigation
- Collapsible sidebar
- Top navigation bar
- Breadcrumbs
- Tabs
- Pagination

### Feedback
- Toast notifications (Sonner)
- Alert banners
- Loading states
- Empty states
- Error messages

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Adaptations
- Collapsible sidebar → hamburger menu
- Stacked grid layouts
- Touch-friendly button sizes (min 44px)
- Simplified navigation

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus visible indicators
- Sufficient color contrast (4.5:1 minimum)
- Alt text for images
- Form labels and error messages

## Dark Mode

### Implementation
- CSS custom properties for theming
- Automatic system preference detection
- Manual toggle in settings
- Smooth transitions between modes

## Performance Optimization

### Best Practices
- Lazy loading for routes
- Image optimization
- Minimal bundle sizes
- Code splitting
- Cached API responses

## File Structure
```
/components
  /ui (shadcn components)
  ├── LandingPage.tsx
  ├── LoginPage.tsx
  ├── SignupPage.tsx
  ├── Onboarding.tsx
  ├── Dashboard.tsx
  ├── JobBoard.tsx
  ├── Applications.tsx
  ├── JobDetails.tsx
  ├── InterviewManager.tsx
  ├── ResumeBuilder.tsx
  ├── Analytics.tsx
  ├── Billing.tsx
  └── Settings.tsx

/styles
  └── globals.css (design tokens & utilities)
```

## Integration Points

### Supabase (Backend)
- Authentication (email, OAuth)
- Database (PostgreSQL)
- Storage (documents, resumes)
- Real-time subscriptions

### External APIs
- OpenAI (resume generation)
- LinkedIn (profile import)
- Stripe (payments)
- SendGrid (email notifications)

## Development Workflow

### Getting Started
1. Install dependencies
2. Configure environment variables
3. Run development server
4. Access at localhost:3000

### Testing
- Unit tests for components
- Integration tests for flows
- E2E tests for critical paths
- Accessibility testing

### Deployment
- Build production bundle
- Deploy to Vercel/Netlify
- Configure environment variables
- Set up CI/CD pipeline

## Future Enhancements

### Planned Features
- Mobile apps (React Native)
- Browser extension
- Email integration (Gmail, Outlook)
- Calendar sync (Google Calendar)
- Salary negotiation calculator
- Company research tools
- Networking tracker
- Job alert notifications
- Cover letter generator
- Video interview practice

## Support

### Documentation
- User guides
- Video tutorials
- FAQ section
- API documentation

### Customer Support
- Email support (all tiers)
- Priority support (Professional+)
- 24/7 support (Enterprise)
- Live chat
- Community forum

## License
© 2025 JobLander. All rights reserved.
