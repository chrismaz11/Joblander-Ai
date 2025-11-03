import express from 'express';
import { generateLetterHtml } from '../services/letterGenerator.js';

const router = express.Router();

// POST /api/generate-cover-letter
router.post('/generate-cover-letter', async (req, res) => {
  try {
    const { templateFilename, rootClass, resume, position, company, tone } = req.body;
    const html = await generateLetterHtml({ templateFilename, rootClass, type: 'cover', resume, position, company, tone });
    res.json({ success: true, html });
  } catch (err) {
    console.error('generate-cover-letter error', err?.message || err);
    res.status(500).json({ success: false, error: 'Failed to generate cover letter' });
  }
});

// POST /api/generate-thank-you
router.post('/generate-thank-you', async (req, res) => {
  try {
    const { templateFilename, rootClass, resume, position, company, tone } = req.body;
    const html = await generateLetterHtml({ templateFilename, rootClass, type: 'thank-you', resume, position, company, tone });
    res.json({ success: true, html });
  } catch (err) {
    console.error('generate-thank-you error', err?.message || err);
    res.status(500).json({ success: false, error: 'Failed to generate thank you letter' });
  }
});

export default router;
