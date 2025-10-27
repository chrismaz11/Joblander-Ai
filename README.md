# JobLander v4.0

A comprehensive job search and resume customization platform with AI-powered features.

## Project Structure

```
JobLander/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── docs/             # Documentation
├── assets/           # Static assets and templates
└── archive/          # Archived files and backups
```

## Quick Start

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Run Tests
```bash
cd frontend
npm test
npm run test:e2e
```

## Features

- AI-powered resume generation
- Job matching and recommendations
- Cover letter automation
- Document parsing and analysis
- Multi-tier subscription system
- AWS integration

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: Drizzle ORM
- **AI**: OpenAI, AWS Bedrock
- **Cloud**: AWS (Amplify, S3, CloudFront)
- **Testing**: Vitest, Playwright

## Environment Setup

1. Copy `.env.example` to `.env` in both frontend and backend directories
2. Configure your environment variables
3. Run database migrations
4. Start development servers

## Deployment

- **Development**: `npm run deploy:dev`
- **Staging**: `npm run deploy:staging`
- **Production**: `npm run deploy:prod`
