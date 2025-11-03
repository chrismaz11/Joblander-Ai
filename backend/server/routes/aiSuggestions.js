import express from 'express';
import { listResumes } from '../../services/storage.js';
import { getJobs } from '../../services/jobService.js';
import { analyzeJobFit, enhanceJobApplication } from '../../services/careerAI.js';
import verifyJwtDual from '../../middleware/verifyJwtDual.js';
import { checkUserUsage, incrementUserUsage } from '../services/tierEnforcement.js';

const router = express.Router();

// Auth middleware (reuse dual JWT verification with legacy support)
const authMiddleware = verifyJwtDual(process.env.JWT_SECRET, process.env.LEGACY_JWT_SECRET);

// Protected endpoint that returns job suggestions based on a user's latest resume.
// Requires JWT and AI quota checks. Query params: limit (optional)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit || '10');

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user context' });
    }

    // Check AI usage quota
    const canUseAI = await checkUserUsage(userId, 'aiGenerations');
    if (!canUseAI) {
      return res.status(402).json({ success: false, error: 'AI usage quota exceeded' });
    }

    // Get user's resumes and pick the most recent
    const resumes = await listResumes(userId);
    if (!resumes || !resumes.length) {
      await incrementUserUsage(userId, 'aiGenerations');
      return res.json({ success: true, message: 'No resumes found for user', jobs: [] });
    }

    const resume = resumes[0].data || resumes[0];

    // Build a search query from title + skills
    const title = (resume.personalInfo?.title || resume.personalInfo?.headline || '').trim();
    const skills = Array.isArray(resume.skills) ? resume.skills.join(' ') : '';
    const query = `${title} ${skills}`.trim() || 'software engineer';

    const jobsResult = await getJobs({ query, limit });
    const jobs = jobsResult.data || [];

    // Compute simple overlap score and optionally use AI analysis/enhancement
    const enriched = await Promise.all(
      jobs.map(async (job) => {
        // simple requirements overlap
        const required = Array.isArray(job.requirements) ? job.requirements : [];
        const resumeSkills = Array.isArray(resume.skills) ? resume.skills.map(s => s.toLowerCase()) : [];
        const matches = required.filter(r => resumeSkills.some(s => r.toLowerCase().includes(s)));
        const overlap = required.length ? Math.round((matches.length / required.length) * 100) : 0;

        let aiAnalysis = null;
        let enhancement = null;

        try {
          // Try to get a more thorough AI analysis if available
          aiAnalysis = await analyzeJobFit(resume, job.description || (Array.isArray(job.requirements) ? job.requirements.join('\n') : job.description || ''));

          // If overlap is low, request targeted enhancements
          if (overlap < 60) {
            enhancement = await enhanceJobApplication({ resume, jobDescription: job.description || '', companyInfo: { name: job.company } });
          }
        } catch (e) {
          // Non-fatal: attach a lightweight suggestion
          enhancement = enhancement || { suggestions: [`Highlight related skills: ${required.slice(0,3).join(', ')}`] };
        }

        return {
          job,
          overlap,
          aiAnalysis,
          enhancement
        };
      })
    );

    // Record usage for the user
    await incrementUserUsage(userId, 'aiGenerations');

    res.json({ success: true, resumeSummary: { title, skills: resume.skills || [] }, jobs: enriched });
  } catch (error) {
    console.error('[aiSuggestions] Error generating suggestions', error);
    res.status(500).json({ success: false, error: 'Failed to generate AI suggestions' });
  }
});

export default router;
