import express from 'express';
import verifyJwtDual from '../../middleware/verifyJwtDual.js';
import { checkUserUsage, incrementUserUsage } from '../services/tierEnforcement.js';
import {
  analyzeJobFit,
  generateNegotiationStrategy,
  generateJobSearchStrategy,
  enhanceJobApplication,
  generateInterviewPrep
} from '../services/careerAI.js';

const router = express.Router();

// Analyze job fit and get improvement suggestions
// Use JWT dual-verification middleware to support rotation grace periods.
const authMiddleware = verifyJwtDual(process.env.JWT_SECRET, process.env.LEGACY_JWT_SECRET);

router.post('/analyze-job-fit', authMiddleware, async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    
    // Check AI usage quota
    const canUseAI = await checkUserUsage(req.user.id, 'aiGenerations');
    if (!canUseAI) {
      return res.status(402).json({ error: 'AI usage quota exceeded' });
    }

    const analysis = await analyzeJobFit(resume, jobDescription);
    await incrementUserUsage(req.user.id, 'aiGenerations');
    
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze job fit' });
  }
});

// Generate salary negotiation strategy
router.post('/salary-negotiation', authMiddleware, async (req, res) => {
  try {
    const canUseAI = await checkUserUsage(req.user.id, 'aiGenerations');
    if (!canUseAI) {
      return res.status(402).json({ error: 'AI usage quota exceeded' });
    }

    const strategy = await generateNegotiationStrategy(req.body);
    await incrementUserUsage(req.user.id, 'aiGenerations');
    
    res.json(strategy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate negotiation strategy' });
  }
});

// Generate personalized job search strategy
router.post('/job-search-strategy', authMiddleware, async (req, res) => {
  try {
    const canUseAI = await checkUserUsage(req.user.id, 'aiGenerations');
    if (!canUseAI) {
      return res.status(402).json({ error: 'AI usage quota exceeded' });
    }

    const strategy = await generateJobSearchStrategy(req.body);
    await incrementUserUsage(req.user.id, 'aiGenerations');
    
    res.json(strategy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate job search strategy' });
  }
});

// Enhance job application materials
router.post('/enhance-application', authMiddleware, async (req, res) => {
  try {
    const canUseAI = await checkUserUsage(req.user.id, 'aiGenerations');
    if (!canUseAI) {
      return res.status(402).json({ error: 'AI usage quota exceeded' });
    }

    const enhancements = await enhanceJobApplication(req.body);
    await incrementUserUsage(req.user.id, 'aiGenerations');
    
    res.json(enhancements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to enhance application materials' });
  }
});

// Generate interview preparation materials
router.post('/interview-prep', authMiddleware, async (req, res) => {
  try {
    const canUseAI = await checkUserUsage(req.user.id, 'aiGenerations');
    if (!canUseAI) {
      return res.status(402).json({ error: 'AI usage quota exceeded' });
    }

    const prepMaterials = await generateInterviewPrep(req.body);
    await incrementUserUsage(req.user.id, 'aiGenerations');
    
    res.json(prepMaterials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate interview prep materials' });
  }
});

export default router;