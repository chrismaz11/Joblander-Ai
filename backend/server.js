import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { getJobs, getJobCities, getJobStats } from "./services/jobService.js";
import { parseResumeFile } from "./services/resumeParser.js";
import {
  createResume,
  listResumes,
  getResume,
  updateResume,
  createCoverLetter,
  listCoverLetters,
  trackUsage,
  getUsage,
} from "./services/storage.js";
import { enhanceResumeContent } from "./services/aiService.js";
import { renderResume, listTemplates } from "./services/resumeGenerator.js";
import { generateResumePDF } from "./services/pdfGenerator.js";
import { buildCoverLetter } from "./services/coverLetterService.js";
import {
  canCreateResume,
  canCreateCoverLetter,
  getTierLimits,
} from "./services/tierService.js";
import careerAIRoutes from "./server/routes/careerAI.js";
import protectedRoutes from "./routes/protected.js";
import lettersRoutes from "./routes/letters.js";
import usageRoutes from "./routes/usage.js";
import aiSuggestionsRoutes from "./server/routes/aiSuggestions.js";

dotenv.config();

// Environment fallbacks for convenience during local development and to handle
// cases where Vercel wrote client-prefixed vars (NEXT_PUBLIC_SUPABASE_URL) but
// server code expects SUPABASE_URL. These are safe no-ops in production when
// the correct server-only envs are set.
if (!process.env.SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log('[env] SUPABASE_URL not set — falling back to NEXT_PUBLIC_SUPABASE_URL');
}

// Ensure a JWT secret is present for token verification. Prefer JWT_SECRET,
// otherwise fall back to LEGACY_JWT_SECRET (temporary) or a dev default.
if (!process.env.JWT_SECRET) {
  if (process.env.LEGACY_JWT_SECRET) {
    process.env.JWT_SECRET = process.env.LEGACY_JWT_SECRET;
    console.log('[env] JWT_SECRET not set — falling back to LEGACY_JWT_SECRET (temporary)');
  } else {
    // Provide a dev-only default so local dev flows work; never use in production.
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
    console.log('[env] JWT_SECRET not set — using dev default (do not use in production)');
  }
}

const app = express();
const PORT = process.env.PORT || 4000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "JobLander API running" }),
);

app.get("/api/health", (req, res) =>
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  }),
);

// Jobs endpoints
app.get("/api/jobs", async (req, res) => {
  try {
    const { query, location, salary, limit } = req.query;
    const result = await getJobs({ query, location, salary, limit: parseInt(limit) || 20 });
    res.json(result);
  } catch (error) {
    console.error("Jobs fetch error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.get("/api/jobs/cities", async (req, res) => {
  try {
    const result = await getJobCities();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

app.get("/api/jobs/stats", async (req, res) => {
  try {
    const result = await getJobStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job stats" });
  }
});

// Resume endpoints
app.post("/api/resumes", async (req, res) => {
  try {
    const userId = req.body.userId || "anonymous";
    
    if (!(await canCreateResume(userId))) {
      return res.status(403).json({ error: "Resume limit reached for your tier" });
    }

    const result = await createResume(req.body);
    await trackUsage(userId, "resume");
    res.json(result);
  } catch (error) {
    console.error("Resume creation error:", error);
    res.status(500).json({ error: "Failed to create resume" });
  }
});

app.get("/api/resumes", async (req, res) => {
  try {
    const userId = req.query.userId || "anonymous";
    const result = await listResumes(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

app.get("/api/resumes/:id", async (req, res) => {
  try {
    const result = await getResume(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

app.put("/api/resumes/:id", async (req, res) => {
  try {
    const result = await updateResume(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update resume" });
  }
});

app.post("/api/resumes/enhance", async (req, res) => {
  try {
    const enhanced = await enhanceResumeContent(req.body);
    res.json({ success: true, data: enhanced });
  } catch (error) {
    console.error("Enhancement error:", error);
    res.status(500).json({ error: "Failed to enhance resume" });
  }
});

// PDF generation endpoint
app.post("/api/resumes/:id/pdf", async (req, res) => {
  try {
    const resume = await getResume(req.params.id);
    if (!resume.success) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const templateId = req.body.templateId || "template-1";
    const pdfResult = await generateResumePDF(resume.data, templateId);
    
    if (pdfResult.success) {
      res.json({
        success: true,
        filename: pdfResult.filename,
        html: pdfResult.html,
        message: pdfResult.message
      });
    } else {
      res.status(500).json({ error: pdfResult.error });
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// Resume parsing endpoint
app.post("/api/parse-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await parseResumeFile(req.file);
    res.json(result);
  } catch (error) {
    console.error("Resume parsing error:", error);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

// Templates endpoint
app.get("/api/templates", async (req, res) => {
  try {
    const result = await listTemplates();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Cover letter endpoints
app.post("/api/cover-letters", async (req, res) => {
  try {
    const userId = req.body.userId || "anonymous";
    
    if (!(await canCreateCoverLetter(userId))) {
      return res.status(403).json({ error: "Cover letter limit reached for your tier" });
    }

    const result = await createCoverLetter(req.body);
    await trackUsage(userId, "coverLetter");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cover letter" });
  }
});

app.get("/api/cover-letters", async (req, res) => {
  try {
    const userId = req.query.userId || "anonymous";
    const result = await listCoverLetters(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cover letters" });
  }
});

// Usage tracking
app.get("/api/usage/:userId", async (req, res) => {
  try {
    const result = await getUsage(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch usage" });
  }
});

app.get("/api/tier-limits/:userId", async (req, res) => {
  try {
    const result = await getTierLimits(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tier limits" });
  }
});

// Protected routes with Supabase auth
app.use('/api', protectedRoutes);

// Usage tracking routes
app.use('/api/usage', usageRoutes);

// Letter generation routes (cover letters, thank-you notes)
app.use('/api/letters', lettersRoutes);

// AI suggestions for jobs based on uploaded resume
app.use('/api/ai-suggestions', aiSuggestionsRoutes);

// AI career assistance routes
app.use('/api/career-ai', careerAIRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
