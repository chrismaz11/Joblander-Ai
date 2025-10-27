import mammoth from "mammoth";
import pdfParse from "pdf-parse";

async function extractFromPdf(buffer) {
  const pdfData = await pdfParse(buffer);
  return pdfData.text ?? "";
}

async function extractFromDocx(buffer) {
  const { value } = await mammoth.extractRawText({ buffer });
  return value ?? "";
}

function tokenizeLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function inferSections(lines) {
  const sections = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    extras: [],
  };

  let current = "summary";

  lines.forEach((line) => {
    const normalized = line.toLowerCase();
    if (normalized.includes("experience")) {
      current = "experience";
      return;
    }
    if (normalized.includes("education")) {
      current = "education";
      return;
    }
    if (normalized.includes("skill")) {
      current = "skills";
      return;
    }
    if (normalized.includes("project")) {
      current = "extras";
      return;
    }
    sections[current].push(line);
  });

  return sections;
}

export async function parseResumeFile(file) {
  if (!file) {
    throw new Error("File is required");
  }

  let rawText = "";
  try {
    if (file.mimetype === "application/pdf") {
      rawText = await extractFromPdf(file.buffer);
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      rawText = await extractFromDocx(file.buffer);
    } else if (file.mimetype?.startsWith("text/")) {
      rawText = file.buffer.toString("utf-8");
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
  } catch (error) {
    console.warn("[resumeParser] extraction failed", error);
    rawText = file.buffer.toString("utf-8");
  }

  const lines = tokenizeLines(rawText);
  const sections = inferSections(lines);

  return {
    rawText,
    sections,
    metadata: {
      filename: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      mimetype: file.mimetype,
    },
  };
}
