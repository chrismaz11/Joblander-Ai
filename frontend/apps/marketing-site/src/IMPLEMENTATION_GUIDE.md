# JobLander Implementation Guide

This guide helps developers implement and customize JobLander for production use.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Backend Integration](#backend-integration)
3. [Authentication Setup](#authentication-setup)
4. [Database Schema](#database-schema)
5. [API Integration](#api-integration)
6. [Payment Processing](#payment-processing)
7. [Deployment](#deployment)
8. [Customization](#customization)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
npm run dev
# or  
yarn dev
```

### 3. Explore Features

Navigate through all pages:
- Landing page at `/`
- Login/Signup flows
- Onboarding (after signup)
- Dashboard and all features

---

## Backend Integration

### Recommended Stack: Supabase

JobLander is designed to work seamlessly with Supabase for:
- Authentication
- PostgreSQL database
- File storage
- Real-time subscriptions

### Setup Supabase

1. **Create Project**
   ```bash
   # Visit https://supabase.com
   # Create new project
   # Note your project URL and anon key
   ```

2. **Install Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Create Supabase Client**
   ```typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

4. **Environment Variables**
   ```bash
   # .env.local
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## Authentication Setup

### Email/Password Authentication

```typescript
// hooks/useAuth.ts
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return { signUp, signIn, signOut }
}
```

### OAuth Integration

```typescript
// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})

// GitHub OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

### Protected Routes

```typescript
// App.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <LoginPage />
  }

  return <Dashboard />
}
```

---

## Database Schema

### Tables

```sql
-- Users Profile
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  job_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'wishlist',
  priority TEXT DEFAULT 'medium',
  applied_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  job_id UUID REFERENCES jobs NOT NULL,
  status TEXT DEFAULT 'applied',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  job_id UUID REFERENCES jobs NOT NULL,
  interview_date TIMESTAMP WITH TIME ZONE,
  interview_type TEXT,
  interviewer TEXT,
  notes TEXT,
  preparation_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  job_id UUID REFERENCES jobs,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline Events
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  job_id UUID REFERENCES jobs NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions (for Stripe integration)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT,
  status TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  feature TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Repeat for other tables...
```

---

## API Integration

### OpenAI for Resume Generation

```typescript
// lib/openai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For demo only! Use backend in production
})

export async function generateResume(
  jobDescription: string,
  userProfile: any
) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a professional resume writer...',
      },
      {
        role: 'user',
        content: `Job Description: ${jobDescription}\n\nUser Profile: ${JSON.stringify(userProfile)}`,
      },
    ],
  })

  return response.choices[0].message.content
}
```

**⚠️ Production Note**: Never expose API keys in frontend code. Move AI generation to a backend API route.

### Backend API Route (Recommended)

```typescript
// api/generate-resume.ts (Next.js API route example)
import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { jobDescription, userProfile } = req.body

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer...',
        },
        {
          role: 'user',
          content: `Job Description: ${jobDescription}\n\nUser Profile: ${JSON.stringify(userProfile)}`,
        },
      ],
    })

    res.status(200).json({ resume: response.choices[0].message.content })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate resume' })
  }
}
```

---

## Payment Processing

### Stripe Integration

1. **Install Stripe**
   ```bash
   npm install @stripe/stripe-js stripe
   ```

2. **Setup Stripe**
   ```typescript
   // lib/stripe.ts
   import { loadStripe } from '@stripe/stripe-js'
   
   export const stripePromise = loadStripe(
     import.meta.env.VITE_STRIPE_PUBLIC_KEY
   )
   ```

3. **Create Checkout Session**
   ```typescript
   // Backend API route
   import Stripe from 'stripe'
   
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
   
   export async function createCheckoutSession(
     userId: string,
     priceId: string
   ) {
     const session = await stripe.checkout.sessions.create({
       customer_email: user.email,
       payment_method_types: ['card'],
       line_items: [
         {
           price: priceId,
           quantity: 1,
         },
       ],
       mode: 'subscription',
       success_url: `${process.env.NEXT_PUBLIC_URL}/billing?success=true`,
       cancel_url: `${process.env.NEXT_PUBLIC_URL}/billing?canceled=true`,
       metadata: {
         userId,
       },
     })
   
     return session
   }
   ```

4. **Handle Webhook**
   ```typescript
   // api/webhooks/stripe.ts
   import Stripe from 'stripe'
   
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
   
   export async function handleWebhook(req: Request) {
     const signature = req.headers.get('stripe-signature')
     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
   
     const event = stripe.webhooks.constructEvent(
       await req.text(),
       signature!,
       webhookSecret
     )
   
     switch (event.type) {
       case 'checkout.session.completed':
         // Update user subscription
         break
       case 'customer.subscription.updated':
         // Update subscription status
         break
       case 'customer.subscription.deleted':
         // Handle cancellation
         break
     }
   
     return new Response(JSON.stringify({ received: true }))
   }
   ```

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Environment Variables**
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   VITE_STRIPE_PUBLIC_KEY=
   OPENAI_API_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   ```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# Add in Netlify dashboard
```

---

## Customization

### Branding

1. **Colors** (in `styles/globals.css`)
   ```css
   :root {
     --brand-primary: #2563eb; /* Change to your brand color */
     --brand-success: #10b981;
     --brand-warning: #f59e0b;
     --brand-error: #ef4444;
   }
   ```

2. **Logo**
   - Replace Sparkles icon in navigation
   - Add your logo image to `/public`
   - Update in `App.tsx`, `LandingPage.tsx`, `LoginPage.tsx`, `SignupPage.tsx`

3. **Typography**
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
   
   body {
     font-family: 'Inter', sans-serif;
   }
   ```

### Feature Toggles

```typescript
// config/features.ts
export const features = {
  aiResume: true,
  billing: true,
  interviews: true,
  analytics: true,
  // Toggle features on/off
}
```

### Pricing

Update pricing in `components/LandingPage.tsx` and `components/Billing.tsx`:

```typescript
const pricingTiers = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    features: [...],
  },
  // Customize tiers
]
```

---

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Check TypeScript config
npx tsc --noEmit
```

**Styling Issues**
```bash
# Rebuild Tailwind
npm run build:css
```

### Performance

**Bundle Size**
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

**Lazy Loading**
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./components/Dashboard'))
const Analytics = lazy(() => import('./components/Analytics'))
```

---

## Best Practices

### Security
- ✅ Never expose API keys in frontend
- ✅ Use environment variables
- ✅ Implement RLS in database
- ✅ Validate all user input
- ✅ Use HTTPS only
- ✅ Implement rate limiting

### Performance
- ✅ Code split by route
- ✅ Lazy load components
- ✅ Optimize images
- ✅ Cache API responses
- ✅ Minimize bundle size

### UX
- ✅ Loading states everywhere
- ✅ Error boundaries
- ✅ Optimistic updates
- ✅ Keyboard shortcuts
- ✅ Toast notifications

---

## Support

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Getting Help
- Check `/DESIGN_SYSTEM.md` for component docs
- Review `/README.md` for overview
- See `/components/StyleGuide.tsx` for examples

---

**Happy Building! 🚀**
