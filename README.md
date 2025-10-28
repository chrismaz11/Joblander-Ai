# JobLander v4.0

> **⚠️ PROPRIETARY SOFTWARE** - All rights reserved. See [LICENSE](./LICENSE) for usage terms.

A comprehensive job application management platform with AI-powered resume generation and job tracking capabilities.

## 🚀 Features

- **AI-Powered Resume Generation** - Multiple professional templates with intelligent content generation
- **Job Application Tracking** - Comprehensive application management and status tracking  
- **Interview Management** - Scheduling, preparation tools, and follow-up tracking
- **Analytics Dashboard** - Insights into application success rates and trends
- **Multi-Platform Support** - Web and mobile-responsive design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **UI**: React, Tailwind CSS
- **State Management**: React Context/Zustand
- **Authentication**: Supabase Auth

### Backend  
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Supabase
- **AI Services**: OpenAI GPT, Google Gemini
- **File Storage**: Supabase Storage

### Infrastructure
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)
- **Monitoring**: PostHog Analytics
- **Payments**: Stripe Integration

## 📁 Project Structure

```
JobLander/
├── frontend/           # Next.js application
│   ├── apps/
│   │   └── marketing-site/  # Main web application
│   ├── components/     # Reusable UI components
│   └── lib/           # Utilities and configurations
├── backend/           # Express.js API server
│   ├── routes/        # API endpoints
│   ├── models/        # Database models
│   └── middleware/    # Authentication & validation
├── docs/             # Documentation
└── assets/           # Static assets and templates
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account
- API keys for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chrismaz11/joblander-v4.git
   cd joblander-v4
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend  
   cd ../backend && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy example environment files
   cp backend/.env.example backend/.env
   cp frontend/apps/marketing-site/.env.example frontend/apps/marketing-site/.env.local
   
   # Edit with your actual values
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   cd backend && npm run migrate
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## 🔐 Security & Environment Variables

**CRITICAL**: Never commit `.env` files containing real API keys. Use `.env.example` files as templates.

Required environment variables:
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`  
- `STRIPE_PUBLISHABLE_KEY` & `STRIPE_SECRET_KEY`
- `NEXTAUTH_SECRET`

## 📄 License & Usage

This software is **proprietary and protected by copyright**. 

- ✅ **Permitted**: Personal evaluation, educational use with attribution
- ❌ **Prohibited**: Commercial use, redistribution, modification without permission

See [LICENSE](./LICENSE) for complete terms.

## 🤝 Contributing

This is a private project. Contributions require explicit approval from the owner.

## 📞 Contact

For licensing inquiries or support: [Contact Information]

---

**© 2024 Christopher Mazzola. All Rights Reserved.**
