import { createWorker } from "tesseract.js";
import { LLMFactory } from './llmAdapter';
import { getTaskConfig } from '../config/llm.config';
import { nanoid } from 'nanoid';

export async function extractTextWithOCR(imageBuffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error("OCR extraction error:", error);
    throw new Error("Failed to extract text from image");
  }
}

export async function cleanTextWithAI(rawText: string): Promise<string> {
  try {
    const adapter = LLMFactory.getDefaultAdapter();
    const taskConfig = getTaskConfig('textCleaning');
    
    const prompt = `You are an expert text processing AI. The following text was extracted from a document using OCR and may contain errors, formatting issues, or noise.

Please clean up and improve this text by:
1. Fixing OCR errors (common character misrecognitions like 0/O, 1/l, etc.)
2. Correcting spelling and grammar mistakes
3. Improving formatting and structure
4. Removing noise and artifacts
5. Preserving all meaningful information

Raw OCR Text:
${rawText}

Return only the cleaned, corrected text. Maintain the original structure and meaning.`;

    const response = await adapter.generateText(prompt, {
      temperature: 0.3,
      maxTokens: 4000,
      cacheTTL: taskConfig?.cacheTTL || 3600000, // 1 hour default
      timeout: taskConfig?.timeout || 30000
    });

    if (!response.success) {
      console.error('Text cleaning failed:', response.error);
      return rawText; // Fall back to original text
    }

    return response.data || rawText;
  } catch (error) {
    console.error('Text cleaning error:', error);
    return rawText;
  }
}

export async function hybridTextExtraction(
  buffer: Buffer,
  extractedText: string,
  mimeType: string
): Promise<string> {
  // Heuristic: If extracted text is too short, it's likely a scanned image
  // Use higher threshold to avoid false positives with short but valid resumes
  const isLikelyScanned = extractedText.trim().length < 200;
  
  if (!isLikelyScanned) {
    // Text-based PDF - use extracted text directly
    return extractedText;
  }

  console.log("Detected scanned document (text < 200 chars), attempting OCR...");

  // For scanned PDFs, we need to convert to images first
  if (mimeType === "application/pdf") {
    let tempDir: string | null = null;
    
    try {
      // Use pdf-poppler to convert PDF to images
      const poppler = await import("pdf-poppler") as any;
      const fs = await import("fs");
      const path = await import("path");
      const os = await import("os");
      
      // Create temp directory for PDF conversion
      tempDir = path.join(os.tmpdir(), `pdf-ocr-${Date.now()}`);
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      // Save PDF to temp file
      const pdfPath = path.join(tempDir, "input.pdf");
      await fs.promises.writeFile(pdfPath, buffer);
      
      // Convert ALL pages of PDF to images (not just first page)
      const opts = {
        format: "png",
        out_dir: tempDir,
        out_prefix: "page",
        // Don't specify page parameter to convert all pages
      };
      
      await poppler.convert(pdfPath, opts);
      
      // Get all generated page images
      const files = await fs.promises.readdir(tempDir);
      const pageImages = files
        .filter((f: string) => f.startsWith('page-') && f.endsWith('.png'))
        .sort((a, b) => {
          // Extract page numbers and sort numerically
          const pageA = parseInt(a.match(/page-(\d+)\.png/)?.[1] || '0', 10);
          const pageB = parseInt(b.match(/page-(\d+)\.png/)?.[1] || '0', 10);
          return pageA - pageB;
        });
      
      if (pageImages.length === 0) {
        throw new Error("No images generated from PDF");
      }
      
      console.log(`Processing ${pageImages.length} pages with OCR...`);
      
      // Extract text from all pages
      const allPageTexts: string[] = [];
      for (const pageImage of pageImages) {
        const imagePath = path.join(tempDir, pageImage);
        const imageBuffer = await fs.promises.readFile(imagePath);
        const ocrText = await extractTextWithOCR(imageBuffer);
        allPageTexts.push(ocrText);
      }
      
      // Concatenate all page texts
      const fullOcrText = allPageTexts.join('\n\n--- Page Break ---\n\n');
      
      // Clean up OCR text with AI
      const cleanedText = await cleanTextWithAI(fullOcrText);
      
      return cleanedText;
    } catch (error) {
      console.error("PDF OCR error:", error);
      // Fall back to original text if OCR fails
      return extractedText;
    } finally {
      // Always clean up temp files, even on error
      if (tempDir) {
        try {
          const fs = await import("fs");
          await fs.promises.rm(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error("Temp cleanup error:", cleanupError);
        }
      }
    }
  }
  
  // For other formats, use original text
  return extractedText;
}

export async function parseResumeWithHybridAI(text: string): Promise<any> {
  try {
    const adapter = LLMFactory.getDefaultAdapter();
    const taskConfig = getTaskConfig('resumeParsing');
    
    // Define the schema for the response
    const schema = {
      type: "object",
      properties: {
        personalInfo: {
          type: "object",
          properties: {
            fullName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            location: { type: "string" },
            linkedin: { type: "string" },
            website: { type: "string" },
            summary: { type: "string" }
          },
          required: ["fullName", "email", "phone", "location", "linkedin", "website", "summary"]
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              company: { type: "string" },
              position: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              current: { type: "boolean" },
              description: { type: "string" }
            },
            required: ["id", "company", "position", "startDate", "endDate", "current", "description"]
          }
        },
        education: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              institution: { type: "string" },
              degree: { type: "string" },
              field: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              current: { type: "boolean" }
            },
            required: ["id", "institution", "degree", "field", "startDate", "endDate", "current"]
          }
        },
        skills: {
          type: "array",
          items: { type: "string" }
        },
        confidence: {
          type: "object",
          properties: {
            overall: { type: "string", enum: ["high", "medium", "low"] },
            fields: {
              type: "object",
              properties: {
                fullName: { type: "string", enum: ["high", "medium", "low"] },
                email: { type: "string", enum: ["high", "medium", "low"] },
                phone: { type: "string", enum: ["high", "medium", "low"] },
                location: { type: "string", enum: ["high", "medium", "low"] },
                linkedin: { type: "string", enum: ["high", "medium", "low"] },
                website: { type: "string", enum: ["high", "medium", "low"] },
                summary: { type: "string", enum: ["high", "medium", "low"] },
                experience: { type: "string", enum: ["high", "medium", "low"] },
                education: { type: "string", enum: ["high", "medium", "low"] },
                skills: { type: "string", enum: ["high", "medium", "low"] }
              }
            }
          }
        },
        rawText: { type: "string" }
      },
      required: ["personalInfo", "experience", "education", "skills", "confidence", "rawText"]
    };
    
    const prompt = `You are an expert resume parser with advanced text correction capabilities. The following text may have been extracted via OCR and could contain errors.

Your task:
1. Intelligently parse the resume information
2. Correct any OCR errors or formatting issues
3. Extract structured information accurately
4. Assess confidence level for each field based on clarity and completeness
5. Fill in missing fields with appropriate defaults
6. Generate unique IDs for experience and education entries

CONFIDENCE SCORING GUIDELINES:
- "high": Field is clearly present, well-formatted, and unambiguous
- "medium": Field is present but may have minor OCR errors or formatting issues
- "low": Field is unclear, has significant errors, or is inferred/guessed

Resume text:
${text}

If any field is not found, use empty string or empty array as appropriate. Always include confidence scoring for each field. Set overall confidence based on the majority of field confidences. Generate unique IDs using nanoid format for experience and education entries.`;

    const response = await adapter.generateJSON(prompt, schema, {
      temperature: 0.3,
      maxTokens: 4000,
      cacheTTL: taskConfig?.cacheTTL || 86400000, // 24 hour default for resume parsing
      timeout: taskConfig?.timeout || 45000
    });

    if (!response.success) {
      console.error('Hybrid AI parsing failed:', response.error);
      return getFallbackParseResult(text);
    }
    
    const result = response.data;
    
    // Ensure IDs are generated for experience and education if missing
    if (result.experience) {
      result.experience = result.experience.map((exp: any) => ({
        ...exp,
        id: exp.id || nanoid()
      }));
    }
    
    if (result.education) {
      result.education = result.education.map((edu: any) => ({
        ...edu,
        id: edu.id || nanoid()
      }));
    }
    
    // Ensure rawText is always included for fallback
    if (!result.rawText) {
      result.rawText = text;
    }
    
    return result;
  } catch (error) {
    console.error('Hybrid AI parsing error:', error);
    return getFallbackParseResult(text);
  }
}

// Helper function for fallback response
function getFallbackParseResult(text: string) {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    confidence: {
      overall: "low" as const,
      fields: {
        fullName: "low" as const,
        email: "low" as const,
        phone: "low" as const,
        location: "low" as const,
        linkedin: "low" as const,
        website: "low" as const,
        summary: "low" as const,
        experience: "low" as const,
        education: "low" as const,
        skills: "low" as const
      }
    },
    rawText: text
  };
}
