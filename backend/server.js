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
import { buildCoverLetter } from "./services/coverLetterService.js";
import {
  canCreateResume,
  canCreateCoverLetter,
  getTierLimits,
} from "./services/tierService.js";

dotenv.config();

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

app.get("/api/jobs", async (req, res) => {
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
    } = req.query;

    const filters = {
      query: typeof query === "string" ? query : undefined,
      location: typeof location === "string" ? location : undefined,
      city: typeof city === "string" ? city : undefined,
      remote: typeof remote === "string" ? remote : undefined,
      salaryRange: typeof salaryRange === "string" ? salaryRange : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      employmentType:
        typeof employmentType === "string"
          ? employmentType.split(",")
          : undefined,
    };

    const result = await getJobs(filters);
    res.json(result);
  } catch (error) {
    console.error("[GET /api/jobs]", error);
    res.status(500).json({ error: "Failed to fetch job listings" });
  }
});

app.get("/api/jobs/cities", async (req, res) => {
  try {
    const { search } = req.query;
    const cities = await getJobCities(
      typeof search === "string" ? search : undefined,
    );
    res.json({ cities });
  } catch (error) {
    console.error("[GET /api/jobs/cities]", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

app.get("/api/jobs/stats", async (req, res) => {
  try {
    const stats = await getJobStats();
    res.json(stats);
  } catch (error) {
    console.error("[GET /api/jobs/stats]", error);
    res.status(500).json({ error: "Failed to fetch job stats" });
  }
});

app.get("/api/resume/templates", (req, res) => {
  res.json(listTemplates());
});

app.post("/api/resume/parse", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const parsed = await parseResumeFile(req.file);
    res.json(parsed);
  } catch (error) {
    console.error("[POST /api/resume/parse]", error);
    res.status(500).json({ error: error.message ?? "Parsing failed" });
  }
});

app.post("/api/resume/generate", async (req, res) => {
  try {
    const {
      userId = "guest-user",
      tier = "free",
      personalInfo,
      experience = [],
      education = [],
      skills = [],
      templateId = "modern",
    } = req.body ?? {};

    const usageSnapshot = await getUsage(userId);
    if (!canCreateResume(tier, usageSnapshot.resumesThisMonth ?? 0)) {
      const limits = getTierLimits(tier);
      return res.status(403).json({
        error: "Resume limit reached for this tier",
        upgradeRequired: true,
        usage: usageSnapshot,
        limits,
      });
    }

    const enhanced = await enhanceResumeContent({
      personalInfo,
      experience,
      education,
      skills,
    });

    const resumeRecord = await createResume({
      userId,
      tier,
      personalInfo: enhanced.personalInfo ?? personalInfo,
      experience: enhanced.experience ?? experience,
      education: enhanced.education ?? education,
      skills: enhanced.skills ?? skills,
      suggestions: enhanced.suggestions ?? [],
      templateId,
    });

    const preview = renderResume(resumeRecord, templateId);
    await trackUsage(userId, "resume");

    res.json({
      resume: resumeRecord,
      preview,
    });
  } catch (error) {
    console.error("[POST /api/resume/generate]", error);
    res.status(500).json({ error: error.message ?? "Failed to generate resume" });
  }
});

app.get("/api/resumes", async (req, res) => {
  const records = await listResumes();
  res.json(records);
});

app.get("/api/resumes/:id", async (req, res) => {
  const resume = await getResume(req.params.id);
  if (!resume) {
    return res.status(404).json({ error: "Resume not found" });
  }
  res.json(resume);
});

app.patch("/api/resumes/:id", async (req, res) => {
  const updated = await updateResume(req.params.id, req.body ?? {});
  if (!updated) {
    return res.status(404).json({ error: "Resume not found" });
  }
  res.json(updated);
});

app.post("/api/cover-letters", async (req, res) => {
  try {
    const {
      resumeId,
      userId = "guest-user",
      tier = "free",
      tone = "professional",
      companyName,
      position,
      jobDescription,
    } = req.body ?? {};

    if (!resumeId || !companyName || !position) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const resume = await getResume(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const usageSnapshot = await getUsage(userId);
    if (!canCreateCoverLetter(tier, usageSnapshot.coverLettersThisMonth ?? 0)) {
      const limits = getTierLimits(tier);
      return res.status(403).json({
        error: "Cover letter limit reached for this tier",
        upgradeRequired: true,
        usage: usageSnapshot,
        limits,
      });
    }

    const coverLetterData = await buildCoverLetter({
      resumeId,
      companyName,
      position,
      tone,
      jobDescription,
      personalInfo: resume.personalInfo,
      personalPitch: resume.personalInfo?.summary,
    });

    const record = await createCoverLetter({
      resumeId,
      userId,
      tier,
      tone: coverLetterData.tone,
      variants: coverLetterData.variants,
      content: coverLetterData.content,
      companyName,
      position,
      jobDescription,
    });

    await trackUsage(userId, "coverLetter");

    res.json(record);
  } catch (error) {
    console.error("[POST /api/cover-letters]", error);
    res.status(500).json({ error: error.message ?? "Failed to generate cover letter" });
  }
});

app.get("/api/cover-letters", async (req, res) => {
  const { resumeId } = req.query;
  const records = await listCoverLetters(
    typeof resumeId === "string" ? { resumeId } : undefined,
  );
  res.json(records);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
