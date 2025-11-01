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
- **Build Tool**: Vite
- **Framework**: React with TypeScript
- **UI**: React, Tailwind CSS
- **State Management**: React Context/Zustand
- **Authentication**: Supabase Auth

### Backend  
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Supabase
- **AI Services**: OpenAI GPT, Google Gemini
- **File Storage**: Supabase Storage

### Infrastructure
- **Frontend**: Vercel deployment
- **Backend**: Supabase (Database + Auth + Storage)
- **Build Tool**: Vite
- **Monitoring**: PostHog Analytics
- **Payments**: Stripe Integration

## 📁 Project Structure

```
JobLander/
├── frontend/           # Vite + React application
│   ├── src/           # Source code
│   │   ├── components/  # React components
│   │   └── lib/        # Utilities and configurations
│   ├── lib/           # Additional utilities
│   └── contexts/      # React contexts
├── backend/           # Express.js API server
│   ├── routes/        # API endpoints
│   ├── models/        # Database models
│   └── middleware/    # Authentication & validation
├── docs/             # Documentation
└── assets/           # Static assets and templates
```

## 🚀 Deployment

This application is deployed and running on:
- **Frontend**: Vercel (https://your-app.vercel.app)
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

### Environment Configuration

The application uses the following environment variables:
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` or `VITE_OPENAI_API_KEY`  
- `VITE_STRIPE_PUBLISHABLE_KEY` & `STRIPE_SECRET_KEY`

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
