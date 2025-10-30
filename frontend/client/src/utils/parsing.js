
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set up the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

/**
 * Extracts text from a PDF file.
 * @param {File} file - The PDF file.
 * @returns {Promise<string>} The extracted text.
 */
const getTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  return text;
};

/**
 * Extracts text from a DOCX file.
 * @param {File} file - The DOCX file.
 * @returns {Promise<string>} The extracted text.
 */
const getTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Extracts text from a TXT file.
 * @param {File} file - The TXT file.
 * @returns {Promise<string>} The extracted text.
 */
const getTextFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

/**
 * A simple regex-based parser to extract information from resume text.
 * This is a basic implementation and can be improved with more sophisticated NLP techniques.
 * @param {string} text - The resume text.
 * @returns {object} The extracted resume data.
 */
const parseText = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/;

  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';

  // Basic name extraction
  const name = text.substring(0, text.indexOf(email) > 0 ? Math.min(30, text.indexOf(email)) : 30).split('\n')[0].trim();

  // Section extraction using the original text with newlines
  const skillsSectionText = text.match(/skills/i) ? text.split(/skills/i)[1]?.split(/experience|education/i)[0] : '';
  const experienceSectionText = text.match(/experience/i) ? text.split(/experience/i)[1]?.split(/education|skills/i)[0] : '';
  const educationSectionText = text.match(/education/i) ? text.split(/education/i)[1]?.split(/experience|skills/i)[0] : '';

  // Split sections into arrays and clean up
  const skills = skillsSectionText.split('\n').map(s => s.trim()).filter(s => s);
  const experience = experienceSectionText.split('\n').map(e => e.trim()).filter(e => e);
  const education = educationSectionText.split('\n').map(e => e.trim()).filter(e => e);

  return {
    name,
    email,
    phone,
    skills,
    experience,
    education,
  };
};


/**
 * Parses a resume file (PDF, DOCX, or TXT) on the client-side.
 * @param {File} file - The resume file to parse.
 * @returns {Promise<object>} An object containing the extracted resume data.
 *                          Returns: { name, email, phone, skills, experience, education }
 * @throws {Error} If the file type is unsupported or parsing fails.
 */
export const parseResumeClient = async (file) => {
  if (!file) {
    throw new Error('No file provided.');
  }

  console.log(`Starting parsing for file: ${file.name}, type: ${file.type}`);

  try {
    let text = '';
    if (file.type === 'application/pdf') {
      text = await getTextFromPdf(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await getTextFromDocx(file);
    } else if (file.type === 'text/plain') {
      text = await getTextFromTxt(file);
    } else {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, or TXT file.`);
    }

    console.log('Successfully extracted text from file.');
    const structuredData = parseText(text);
    console.log('Successfully parsed structured data:', structuredData);
    
    return structuredData;

  } catch (error) {
    console.error('Error during resume parsing:', error);
    throw new Error(`Failed to parse the resume. Reason: ${error.message}`);
  }
};
