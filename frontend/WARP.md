# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview


**Core Features:**
- AI resume parsing and content enhancement using Gemini AI
- Blockchain verification using Polygon Mumbai testnet
- Job search with AI-powered matching scores
- Cover letter generation with multiple tone variants
- Portfolio generation and export

## Commands

### Development
```bash
# Start development server (runs both frontend and backend)
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push
```

### Testing & Development
```bash
# Run single test file
npm test -- --testNamePattern="specific test name"

# Check TypeScript types across the project
npx tsc --noEmit

# Check database connection
curl http://localhost:5000/api/admin/llm/health
```

### API Testing
```bash
# Test resume parsing
curl -X POST http://localhost:5000/api/parse-resume \
  -F "file=@path/to/resume.pdf"

# Test AI health
curl http://localhost:5000/api/admin/llm/health

# Test blockchain verification
curl -X POST http://localhost:5000/api/verify-on-chain \
  -F "file=@path/to/resume.pdf"
```

## Architecture

### High-Level Structure

**Frontend (React + Vite):**
- `client/src/`: React application with TypeScript
- `client/src/pages/`: Main application pages
- `client/src/components/`: Reusable UI components using Shadcn/UI
- Router: Wouter for client-side routing
- State: React Query for server state management

**Backend (Express + TypeScript):**
- `server/`: Node.js/Express API server
- `server/services/`: Core business logic modules
- `server/routes.ts`: Centralized API route definitions
- `shared/schema.ts`: Shared TypeScript types and Zod validation schemas

**Database:**
- PostgreSQL with Drizzle ORM
- Schema defined in `shared/schema.ts`
- Migrations in `migrations/` directory

### Service Architecture

**LLM Integration (`server/services/`):**
- `llmAdapter.ts`: Centralized LLM abstraction layer
- `gemini.ts`: Gemini AI integration for content generation
- `llmCache.ts`: Intelligent caching for LLM responses
- `llmMetrics.ts`: Performance monitoring and cost tracking
- `prompts/`: Structured prompt templates

**External Integrations:**
- `jobs.ts`: JSearch API for job listings with AI ranking
- `blockchain.ts`: Web3 integration for resume verification
- `ocrParser.ts`: Hybrid OCR + AI document parsing

**Core Services:**
- `storage.ts`: Database operations using Drizzle ORM
- `portfolioGenerator.ts`: HTML portfolio generation
- `vercelExport.ts`: Portfolio deployment package creation

### Key Data Models

**Resume Structure:**
```typescript
interface Resume {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  templateId?: string;
  pdfUrl?: string;
  blockchainHash?: string;
  verifiedAt?: Date;
}
```

**AI Enhancement Pipeline:**
1. Document parsing (PDF/DOCX → text)
2. OCR fallback for scanned documents
3. AI content extraction and structuring
4. Professional enhancement suggestions
6. Blockchain verification

### Authentication & Authorization

- Protected routes use `isAuthenticated` middleware
- User context available in authenticated requests as `req.user.claims.sub`

## Environment Setup

### Required API Keys

Copy `.env.example` to `.env` and configure:

**AI Services:**
- `GEMINI_API_KEY`: Google AI Studio API key for content generation
- LLM caching and metrics automatically configured

**External APIs:**
- `JSEARCH_API_KEY`: RapidAPI job search integration

**Blockchain (Polygon Mumbai):**
- `WEB3_RPC_URL`: Alchemy/Infura/QuickNode RPC endpoint
- `PRIVATE_KEY`: Testnet wallet private key
- `CONTRACT_ADDRESS`: Deployed ResumeVerifier contract address

**Database:**
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned)

### Smart Contract Deployment

The blockchain verification uses a Solidity contract (`contracts/Verifier.sol`):

```bash
# Deploy contract to Polygon Mumbai
npx hardhat run scripts/deploy.js --network mumbai

# Update CONTRACT_ADDRESS in .env with deployed address
```

## Development Patterns

### API Route Structure

All routes defined in `server/routes.ts` with consistent patterns:
- Authentication: `isAuthenticated` middleware for protected routes
- File uploads: Multer middleware for PDF/DOCX processing
- Error handling: Centralized error responses
- Validation: Zod schemas from `shared/schema.ts`

### Frontend Component Patterns

- **Page Components**: Located in `client/src/pages/`, handle routing and layout
- **UI Components**: Shadcn/UI based, located in `client/src/components/ui/`
- **Business Components**: Feature-specific components in `client/src/components/`
- **Styling**: TailwindCSS with design system from `design_guidelines.md`
- **Theme**: Dark mode by default, customizable via theme provider

### Database Operations

**Using Drizzle ORM:**
```typescript
// Queries use the storage service
const resume = await storage.getResume(id);
const resumes = await storage.getResumesByUserId(userId);

// Type-safe inserts with Zod validation
const newResume = await storage.createResume(insertResumeSchema.parse(data));
```

### AI Integration Best Practices

**Centralized LLM Usage:**
```typescript
// Use the LLM adapter, not direct API calls
const adapter = LLMFactory.getDefaultAdapter();
const response = await adapter.generateJSON(prompt, schema, options);
```

**Caching Strategy:**
- Resume parsing: 24h cache (content rarely changes for same document)
- Job matching: 1h cache (job descriptions are relatively stable)
- Cover letters: 30min cache (balance between freshness and efficiency)

**Error Handling:**
- Always provide fallback responses for AI failures
- Include confidence scores in AI responses
- Log errors for monitoring but don't expose internal details

### Blockchain Integration

**Verification Flow:**
1. Generate SHA-256 hash from resume PDF
2. Submit to Polygon Mumbai testnet
3. Store transaction hash for proof
4. Provide verification URL for employers

**Gas Optimization:**
- Batch verification for multiple resumes
- Estimate gas before transactions
- Use events for efficient querying

## File Structure Key Points

```
├── client/                 # Frontend React app
│   ├── src/pages/         # Main app pages
│   └── src/components/    # Reusable components
├── server/                # Backend API server
│   ├── services/          # Business logic layer
│   └── config/           # Configuration files
├── shared/                # Shared TypeScript definitions
├── contracts/             # Solidity smart contracts
└── migrations/           # Database migrations
```

## Common Debugging

**LLM Issues:**
- Check health endpoint: `/api/admin/llm/health`
- Review metrics: `/api/admin/llm/metrics`
- Clear cache if needed: `DELETE /api/admin/llm/cache`

**Database Issues:**
- Ensure DATABASE_URL is set correctly
- Run `npm run db:push` to sync schema changes
- Check connection in server logs

**Blockchain Issues:**
- Verify RPC endpoint is accessible
- Ensure testnet MATIC balance for gas fees
- Check contract address is deployed and correct

## Performance Considerations

**LLM Optimization:**
- Intelligent caching reduces API costs by ~60%
- Batch operations where possible (cover letter variants)
- Monitor token usage via metrics endpoint

**Database:**
- Use indexed queries for user-specific data
- Implement pagination for large result sets
- JSON fields for flexible resume data storage

**Frontend:**
- React Query handles caching and background updates
- Lazy loading for large components
- Optimistic updates for better UX
