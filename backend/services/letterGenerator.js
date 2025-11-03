import fs from 'fs';
import path from 'path';
import { generateLetter } from './careerAI.js';

/**
 * Simple letter generator that inlines a chosen CSS template and returns HTML.
 * This is a non-AI fallback generator. Replace the `generateBodyText` implementation
 * with an AI call (careerAI) to produce tailored text per resume.
 */

function readCssForTemplate(templateFilename) {
  try {
    const cssPath = path.resolve(process.cwd(), 'adobe-templates', templateFilename);
    return fs.readFileSync(cssPath, 'utf8');
  } catch (err) {
    console.warn('Could not read CSS for template', templateFilename, err?.message || err);
    return null;
  }
}

async function generateBodyText({ type = 'cover', resume = {}, position = '', company = '', tone = 'professional', templateMeta = {} }) {
  // Prefer AI-generated text if careerAI is available
  try {
    const aiResult = await generateLetter({ type, resume, position, company, tone, templateMeta });
    if (aiResult && typeof aiResult === 'string' && aiResult.trim().length > 0) {
      return aiResult;
    }
  } catch (err) {
    console.warn('AI letter generation failed, falling back to template. ', err?.message || err);
  }

  // Simple templated fallback
  const name = resume.name || 'Candidate';
  if (type === 'cover') {
    return `Dear Hiring Manager at ${company || 'the company'},\n\nI am writing to express my interest in the ${position || 'open position'} at ${company || ''}. Based on my experience (${resume.summary || 'relevant experience'}), I am confident I can contribute to your team.\n\nSincerely,\n${name}`;
  }

  // thank-you
  return `Dear ${resume.hiringManagerName || 'Hiring Manager'},\n\nThank you for taking the time to speak with me about the ${position || 'role'} at ${company || ''}. I appreciated learning more about the team and I'm excited about the opportunity.\n\nBest,\n${name}`;
}

export async function generateLetterHtml({ templateFilename = 'white-yellow-minimal-cv.css', rootClass = 'resume-cv--white-yellow', type = 'cover', resume = {}, position = '', company = '', tone = 'professional', templateMeta = {} }) {
  const css = readCssForTemplate(templateFilename) || '';

  const bodyText = await generateBodyText({ type, resume, position, company, tone, templateMeta });
  // Convert newlines to <p> and <br/>
  const paragraphs = bodyText.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('\n');

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
    ${css}
    /* minimal letter tweaks */
    body { margin: 0; padding: 1.6rem; background: transparent; }
    .letter-container { max-width: 800px; margin: 0 auto; }
    .letter-header { margin-bottom: 1rem; }
    .letter-body { font-family: var(--body-font, Arial, sans-serif); color: var(--text-main, #222); }
    </style>
  </head>
  <body>
    <div class="letter-container ${rootClass}">
      <div class="letter-header resume-header">
        <div class="resume-title">${resume.name || 'Candidate Name'}</div>
        <div class="resume-subtitle">${resume.title || ''}</div>
      </div>
      <div class="letter-body resume-body">
        ${paragraphs}
      </div>
    </div>
  </body>
</html>`;

  return html;
}

export default { generateLetterHtml };
