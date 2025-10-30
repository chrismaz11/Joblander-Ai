import type { Express } from "express";
import type Stripe from "stripe";
import { createServer, type Server } from "http";
import multer from "multer";
import mammoth from "mammoth";
import { storage } from "./storage";
import { parseResumeWithAI, generateResumeContent, generateCoverLetter, generateAllCoverLetterTones, calculateJobMatch, rankJobsByRelevance, suggestCities } from "./services/gemini";
import { hybridTextExtraction, parseResumeWithHybridAI } from "./services/ocrParser";
import { generateResumeHash, verifyOnChain, checkVerification, estimateVerificationGas, batchVerifyOnChain } from "./services/blockchain";
import { searchJobs, getAvailableCities, getJobStatistics, type JobSearchFilters } from "./services/jobs";
import { setupAuth, isAuthenticated } from "./simpleAuth";
import { checkUserUsage, getUserTier, incrementUserUsage, canCreateResume, getTierLimits } from "./services/tierEnforcement";
import { testConnection } from "./db";
import { 
  generatePortfolioHTML, 
  getAvailableThemes, 
  getAvailableFonts, 
  getLayoutOptions,
  type PortfolioOptions 
} from "./services/portfolioGenerator";
import { createPortfolioExportPackage } from "./services/vercelExport";
import { generateResume } from "./services/htmlGenerator";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes for AWS Amplify
  app.get("/api/user/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "No authorization header" });
      }

      // For now, return mock user data - you'll replace this with actual JWT verification
      const mockUser = {
        id: "user-123",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        tier: "free"
      };
      
      res.json(mockUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user/create", async (req, res) => {
    try {
      const { id, email, firstName, lastName } = req.body;
      
      // For now, return the created user - you'll replace this with actual database operations
      const newUser = {
        id,
        email,
        firstName,
        lastName,
        tier: "free",
        createdAt: new Date().toISOString()
      };

      res.json(newUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const { email, priceId, userId } = req.body;
      
      const { createCustomer, createSubscription, PRICING_PLANS } = await import("./services/stripe");
      
      // Create Stripe customer
      const customer = await createCustomer(email);
      
      // Create subscription
      const subscription = await createSubscription(customer.id, priceId);
      
      let clientSecret: string | undefined;
      const latestInvoice = subscription.latest_invoice;

      if (latestInvoice && typeof latestInvoice !== "string") {
        const invoice = latestInvoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent;

        if (paymentIntent && typeof paymentIntent !== "string") {
          clientSecret = paymentIntent.client_secret ?? undefined;
        }
      }

      res.json({
        subscriptionId: subscription.id,
        clientSecret,
        customerId: customer.id
      });
    } catch (error: any) {
      console.error("Create subscription error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cancel-subscription", async (req, res) => {
    try {
      const { subscriptionId } = req.body;
      const { cancelSubscription } = await import("./services/stripe");
      
      const subscription = await cancelSubscription(subscriptionId);
      res.json({ success: true, subscription });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const { stripe } = await import("./services/stripe");
      const sig = req.headers['stripe-signature'];
      
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as any;
          // Update user tier in database
          console.log('Subscription updated:', subscription.id);
          break;
        case 'customer.subscription.deleted':
          const deletedSub = event.data.object as any;
          // Downgrade user to free tier
          console.log('Subscription cancelled:', deletedSub.id);
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/pricing-plans", async (req, res) => {
    try {
      const { PRICING_PLANS } = await import("./services/stripe");
      res.json(PRICING_PLANS);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    const dbConnected = await testConnection();
    
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      database: dbConnected ? 'connected' : 'disconnected'
    });
  });

  
  // Parse resume from PDF/DOCX with hybrid OCR + AI approach
  app.post("/api/parse-resume", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let rawText = "";
      const mimeType = req.file.mimetype;

      console.log('=== JOB LANDER DEBUG ===');
      console.log('File details:', {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size
      });

      // Step 1: Library-based text extraction
      try {
        if (mimeType === "application/pdf") {
          const { default: pdfParse } = await import("pdf-parse");
          const pdfData = await pdfParse(req.file.buffer);
          rawText = pdfData.text;
          console.log('Extracted text length (pdf-parse):', rawText.length);
          console.log('First 200 chars:', rawText.substring(0, 200));
        } else if (
          mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          rawText = result.value;
          console.log('Extracted text length (mammoth):', rawText.length);
          console.log('First 200 chars:', rawText.substring(0, 200));
        } else {
          console.error('Unsupported file type:', mimeType);
          return res.status(400).json({ error: "Unsupported file type" });
        }
      } catch (extractionError) {
        console.error('Text extraction failed:', extractionError);
        // We can still attempt OCR even if library extraction fails
        rawText = ''; 
      }

      // Step 2: Hybrid extraction (OCR for scanned documents)
      const enhancedText = await hybridTextExtraction(
        req.file.buffer,
        rawText,
        mimeType
      );

      // Step 3: AI parsing with error correction
      const parsedData = await parseResumeWithHybridAI(enhancedText);
      
      res.json(parsedData);
    } catch (error: any) {
      console.error("Parse resume error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate resume (protected route with tier enforcement)
  app.post("/api/generate-resume", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { personalInfo, experience, education, skills, templateId } = req.body;

      // Check user tier and usage limits
      const userUsage = await checkUserUsage(userId);
      const userTier = await getUserTier(userId);
      
      if (!canCreateResume(userTier, userUsage.resumesThisMonth)) {
        return res.status(403).json({ 
          error: 'Resume limit reached', 
          upgradeRequired: true,
          currentUsage: userUsage.resumesThisMonth,
          limit: getTierLimits(userTier).resumesPerMonth
        });
      }

      // Enhance content with AI
      const enhancedContent = await generateResumeContent({
        personalInfo,
        experience,
        education,
        skills,
      });

      const enhanced = JSON.parse(enhancedContent);
      const finalData = {
        userId,
        personalInfo: enhanced.personalInfo || personalInfo,
        experience: enhanced.experience || experience,
        education: enhanced.education || education,
        skills: enhanced.skills || skills,
        templateId,
      };

      // Save to storage with userId
      const resumeRecord = await storage.createResume(finalData);

      // Track usage
      await incrementUserUsage(userId, 'resume_created');

      // Generate HTML preview
      const templateKey = templateId || 'modern';
      const preview = generateResume({
        name: finalData.personalInfo?.fullName,
        email: finalData.personalInfo?.email,
        phone: finalData.personalInfo?.phone,
        ...finalData
      }, templateKey);

      res.json({ resumeRecord, preview });

    } catch (error: any) {
      console.error("Generate resume error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate cover letter - returns all 3 tone variants
  app.post("/api/generate-coverletter", async (req, res) => {
    try {
      const { resumeId, companyName, position, jobDescription, tone } = req.body;

      if (!resumeId || !companyName || !position) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      // Generate all 3 tone variants in one request for efficiency
      const variants = await generateAllCoverLetterTones({
        personalInfo: resume.personalInfo,
        companyName,
        position,
        jobDescription,
        experience: resume.experience || [],
        skills: resume.skills || [],
      });

      // Save cover letter with all variants
      const coverLetter = await storage.createCoverLetter({
        resumeId,
        companyName,
        position,
        content: variants.professional, // Default to professional
        tone: tone || "professional",
        variants,
        jobDescription,
      });

      res.json(coverLetter);
    } catch (error: any) {
      console.error("Generate cover letter error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // List cover letters for authenticated user
  app.get("/api/cover-letters", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const letters = await storage.getCoverLettersByUserId(userId);
      res.json(letters);
    } catch (error: any) {
      console.error("List cover letters error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Verify resume on blockchain
  app.post("/api/verify-on-chain", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Generate hash from file
      const resumeHash = generateResumeHash(req.file.buffer);

      // Create metadata
      const metadata = {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        timestamp: new Date().toISOString(),
      };

      // Verify on blockchain
      const result = await verifyOnChain(resumeHash, metadata);

      if (result.success) {
        res.json({
          verified: true,
          hash: resumeHash,
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          timestamp: result.timestamp,
          network: "Polygon Mumbai Testnet",
          explorerUrl: `https://mumbai.polygonscan.com/tx/${result.transactionHash}`,
        });
      } else {
        res.status(500).json({ error: result.error || "Verification failed" });
      }
    } catch (error: any) {
      console.error("Blockchain verification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Check if resume is verified
  app.post("/api/verify-resume", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const resumeHash = generateResumeHash(req.file.buffer);
      const result = await checkVerification(resumeHash);

      res.json(result);
    } catch (error: any) {
      console.error("Resume verification check error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Estimate gas for verification
  app.post("/api/estimate-gas", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const resumeHash = generateResumeHash(req.file.buffer);
      const estimate = await estimateVerificationGas(resumeHash);

      res.json(estimate);
    } catch (error: any) {
      console.error("Gas estimation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Batch verify multiple resumes
  app.post("/api/batch-verify", async (req, res) => {
    try {
      const { hashes, metadata } = req.body;

      if (!hashes || !Array.isArray(hashes) || hashes.length === 0) {
        return res.status(400).json({ error: "No hashes provided for batch verification" });
      }

      if (hashes.length > 50) {
        return res.status(400).json({ error: "Too many hashes (max 50 per batch)" });
      }

      const result = await batchVerifyOnChain(hashes, metadata);

      if (result.success) {
        res.json({
          success: true,
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          verifiedCount: result.verifiedCount,
          gasUsed: result.gasUsed,
          explorerUrl: result.explorerUrl,
          network: "Polygon Mumbai Testnet"
        });
      } else {
        res.status(500).json({ error: result.error || "Batch verification failed" });
      }
    } catch (error: any) {
      console.error("Batch verification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Check verification by hash (without file upload)
  app.get("/api/check-verification/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      
      if (!hash) {
        return res.status(400).json({ error: "Hash parameter required" });
      }

      const result = await checkVerification(hash);
      res.json(result);
    } catch (error: any) {
      console.error("Verification check error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Find jobs with enhanced filters
  app.get("/api/find-jobs", async (req, res) => {
    try {
      const { 
        query, 
        location, 
        city, 
        remote, 
        employmentType, 
        salaryRange, 
        page, 
        limit,
        useSemanticRanking 
      } = req.query;

      // Build filters object
      const filters: JobSearchFilters = {
        query: query as string,
        location: location as string,
        city: city as string,
        remote: remote as "yes" | "no" | "any",
        employmentType: employmentType ? (employmentType as string).split(',') : undefined,
        salaryRange: salaryRange as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10
      };

      // Search jobs with filters
      const result = await searchJobs(filters);

      // Apply semantic ranking if requested and we have results
      if (useSemanticRanking === 'true' && result.data.length > 0 && (query || city)) {
        const rankedJobs = await rankJobsByRelevance(
          result.data, 
          (query || city) as string,
          {
            // You could add user preferences here if available
          }
        );
        result.data = rankedJobs;
      }

      res.json(result);
    } catch (error: any) {
      console.error("Job search error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get available cities for autocomplete
  app.get("/api/cities", async (req, res) => {
    try {
      const { search } = req.query;
      const cities = getAvailableCities();
      
      if (search) {
        const suggestions = await suggestCities(search as string, cities);
        res.json({ cities: suggestions });
      } else {
        res.json({ cities: cities.slice(0, 20) });
      }
    } catch (error: any) {
      console.error("Get cities error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get job search statistics
  app.get("/api/job-stats", async (req, res) => {
    try {
      const stats = getJobStatistics();
      res.json(stats);
    } catch (error: any) {
      console.error("Get job stats error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create resume (protected)
  app.post("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        personalInfo,
        experience = [],
        education = [],
        skills = [],
        templateId = null,
      } = req.body || {};

      if (!personalInfo) {
        return res.status(400).json({ error: "personalInfo is required" });
      }

      const resume = await storage.createResume({
        userId,
        personalInfo,
        experience,
        education,
        skills,
        templateId,
      } as any);

      await incrementUserUsage(userId, "resume_created");
      res.status(201).json(resume);
    } catch (error: any) {
      console.error("Create resume error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's resumes (protected)
  app.get("/api/resumes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getResumesByUserId(userId);
      res.json(resumes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single resume
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update resume (protected)
  app.patch("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updated = await storage.updateResume(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete resume (protected)
  app.delete("/api/resumes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      if (resume.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await storage.deleteResume(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Portfolio Generation Endpoints
  
  // Generate portfolio HTML
  app.post("/api/generate-portfolio", async (req, res) => {
    try {
      const { resumeId, options } = req.body;
      
      if (!resumeId) {
        return res.status(400).json({ error: "Resume ID required" });
      }
      
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      const portfolioOptions: PortfolioOptions = {
        theme: options?.theme || "professionalBlue",
        font: options?.font || "Inter",
        layout: options?.layout || "centered",
        includeContactForm: options?.includeContactForm || false,
        includeAnalytics: options?.includeAnalytics || false
      };
      
      const html = generatePortfolioHTML(resume, portfolioOptions);
      
      res.json({ 
        html,
        options: portfolioOptions,
        resumeId
      });
    } catch (error: any) {
      console.error("Generate portfolio error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get portfolio preview
  app.get("/api/portfolio/preview/:resumeId", async (req, res) => {
    try {
      const { resumeId } = req.params;
      const { theme, font, layout } = req.query;
      
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      const options: PortfolioOptions = {
        theme: (theme as string) || "professionalBlue",
        font: (font as string) || "Inter", 
        layout: (layout as "sidebar" | "centered" | "full-width") || "centered"
      };
      
      const html = generatePortfolioHTML(resume, options);
      
      // Return HTML directly for iframe preview
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error: any) {
      console.error("Portfolio preview error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Export portfolio with Vercel config
  app.post("/api/portfolio/export", async (req, res) => {
    try {
      const { resumeId, options } = req.body;
      
      if (!resumeId) {
        return res.status(400).json({ error: "Resume ID required" });
      }
      
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      const portfolioOptions: PortfolioOptions = {
        theme: options?.theme || "professionalBlue",
        font: options?.font || "Inter",
        layout: options?.layout || "centered",
        includeContactForm: options?.includeContactForm || false,
        includeAnalytics: options?.includeAnalytics || false
      };
      
      const exportPackage = createPortfolioExportPackage(resume, portfolioOptions);
      
      res.json(exportPackage);
    } catch (error: any) {
      console.error("Portfolio export error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get available portfolio themes
  app.get("/api/portfolio/themes", async (req, res) => {
    try {
      const themes = getAvailableThemes();
      res.json(themes);
    } catch (error: any) {
      console.error("Get themes error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get available portfolio fonts
  app.get("/api/portfolio/fonts", async (req, res) => {
    try {
      const fonts = getAvailableFonts();
      res.json(fonts);
    } catch (error: any) {
      console.error("Get fonts error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get available portfolio layouts
  app.get("/api/portfolio/layouts", async (req, res) => {
    try {
      const layouts = getLayoutOptions();
      res.json(layouts);
    } catch (error: any) {
      console.error("Get layouts error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ===== LLM Cache Management Endpoints =====
  
  // Import cache and metrics modules
  const { llmCache } = await import("./services/llmCache");
  const { llmMetrics } = await import("./services/llmMetrics");
  const { validateLLMConfig } = await import("./config/llm.config");

  // Get cache statistics
  app.get("/api/admin/llm/cache/stats", async (req, res) => {
    try {
      const stats = llmCache.getStats();
      const entries = llmCache.getEntriesSummary();
      res.json({
        stats,
        topEntries: entries.slice(0, 10),
        totalEntries: entries.length
      });
    } catch (error: any) {
      console.error("Get cache stats error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Clear entire cache
  app.delete("/api/admin/llm/cache", async (req, res) => {
    try {
      await llmCache.clear();
      res.json({ message: "Cache cleared successfully", timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error("Clear cache error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Clear cache by pattern
  app.delete("/api/admin/llm/cache/pattern", async (req, res) => {
    try {
      const { pattern } = req.body;
      if (!pattern) {
        return res.status(400).json({ error: "Pattern is required" });
      }
      
      const cleared = await llmCache.clearByPattern(pattern);
      res.json({ 
        message: `Cleared ${cleared} cache entries matching pattern: ${pattern}`,
        cleared,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Clear cache by pattern error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get LLM metrics
  app.get("/api/admin/llm/metrics", async (req, res) => {
    try {
      const { since } = req.query;
      const sinceMs = since ? parseInt(since as string, 10) : undefined;
      
      const metrics = llmMetrics.getMetrics(sinceMs);
      const providerMetrics = llmMetrics.getProviderMetrics(sinceMs);
      const operationMetrics = llmMetrics.getOperationMetrics(sinceMs);
      const costBreakdown = llmMetrics.getCostBreakdown();
      const summary = llmMetrics.getSummary();
      
      res.json({
        summary,
        aggregated: metrics,
        byProvider: providerMetrics,
        byOperation: operationMetrics,
        costs: costBreakdown,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Get metrics error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Export metrics for analysis
  app.get("/api/admin/llm/metrics/export", async (req, res) => {
    try {
      const format = (req.query.format as string) || 'json';
      const data = llmMetrics.exportMetrics(format as 'json' | 'csv');
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="llm-metrics-${Date.now()}.csv"`);
        res.send(data);
      } else {
        res.json(JSON.parse(data));
      }
    } catch (error: any) {
      console.error("Export metrics error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Clear metrics data
  app.delete("/api/admin/llm/metrics", async (req, res) => {
    try {
      llmMetrics.clear();
      res.json({ message: "Metrics cleared successfully", timestamp: new Date().toISOString() });
    } catch (error: any) {
      console.error("Clear metrics error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get LLM configuration and health
  app.get("/api/admin/llm/health", async (req, res) => {
    try {
      const errors = validateLLMConfig();
      const { serviceMetadata } = await import("./services/gemini");
      const summary = llmMetrics.getSummary();
      
      res.json({
        healthy: errors.length === 0 && summary.status !== 'critical',
        status: summary.status,
        configErrors: errors,
        metadata: serviceMetadata,
        alerts: summary.alerts,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Get health error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Test LLM connection with a simple prompt
  app.post("/api/admin/llm/test", async (req, res) => {
    try {
      const { provider, prompt } = req.body;
      const testPrompt = prompt || "Hello, respond with 'OK' if you're working.";
      
      const { LLMFactory } = await import("./services/llmAdapter");
      const adapter = provider 
        ? LLMFactory.createAdapter(provider as any)
        : LLMFactory.getDefaultAdapter();
      
      const response = await adapter.generateText(testPrompt, {
        temperature: 0.1,
        maxTokens: 50,
        cacheTTL: 0 // Don't cache test prompts
      });
      
      res.json({
        success: response.success,
        response: response.data,
        metadata: {
          provider: response.provider,
          model: response.model,
          latency: response.latency,
          confidence: response.confidence
        },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Test LLM error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
