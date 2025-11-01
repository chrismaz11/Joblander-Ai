import OpenAI from "openai";
import fetch from "cross-fetch";
import type { AppConfig } from "../config/env.js";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";

export interface ResumePayload {
  userId: string;
  title: string;
  experience: Array<{ company: string; role: string; impact: string; start?: string; end?: string }>;
  skills: string[];
  summary?: string;
  templateRef?: string;
}

export interface CoverLetterPayload {
  userId: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  tone?: "professional" | "enthusiastic" | "executive";
}

export class AiService {
  private readonly openai: OpenAI;
  private readonly config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }

  async generateResume(
    prisma: PrismaClient,
    payload: ResumePayload,
  ) {
    const prompt = `Craft an executive-grade resume for ${payload.title}. Use the following details:\n` +
      `Summary: ${payload.summary ?? "N/A"}\n` +
      `Skills: ${payload.skills.join(", ")}\n` +
      `Experience: ${payload.experience
        .map(
          (exp) =>
            `${exp.role} at ${exp.company} (${exp.start ?? "N/A"} - ${exp.end ?? "Present"}): ${exp.impact}`,
        )
        .join("\n")}\n` +
      `Return JSON with keys: summary, sections (array of { heading, bullets }), and keywords.`;

    const result = await this.invokeModel(prompt);
    const document = this.safeParseJson(result, {
      summary: z.string().optional(),
      sections: z.array(
        z.object({
          heading: z.string(),
          bullets: z.array(z.string()),
        }),
      ).optional(),
      keywords: z.array(z.string()).optional(),
    });

    const htmlContent = this.toHtml(document);

    const record = await prisma.resume.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        htmlContent,
        jsonSchema: document,
        templateRef: payload.templateRef,
      },
    });
    return record;
  }

  async generateCoverLetter(
    prisma: PrismaClient,
    payload: CoverLetterPayload,
  ) {
    const prompt = `Write a ${payload.tone ?? "professional"} cover letter for ${payload.jobTitle} at ${payload.company}.` +
      ` Incorporate achievements from resume ${payload.resumeId} and respond directly to this job description:\n${payload.jobDescription}` +
      ` Return JSON with keys: greeting, opening, body (array of paragraphs), closing, signature.`;

    const result = await this.invokeModel(prompt);
    const document = this.safeParseJson(result, {
      greeting: z.string().optional(),
      opening: z.string().optional(),
      body: z.array(z.string()).optional(),
      closing: z.string().optional(),
      signature: z.string().optional(),
    });
    const htmlContent = this.coverLetterToHtml(document);

    const record = await prisma.coverLetter.create({
      data: {
        userId: payload.userId,
        resumeId: payload.resumeId,
        title: `${payload.jobTitle} @ ${payload.company}`,
        content: document.body?.join("\n\n") ?? "",
        htmlContent,
      },
    });

    return record;
  }

  private async invokeModel(prompt: string): Promise<any> {
    try {
      const completion = await this.openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: "You are an elite executive talent copilot outputting JSON." },
          { role: "user", content: prompt },
        ],
      });
      const text = completion.output_text ?? "{}";
      // Return raw text for downstream parsing; avoid throwing here so fallback logic can run.
      return text;
    } catch (error) {
      if (!this.config.OLLAMA_HOST) throw error;
      const response = await fetch(`${this.config.OLLAMA_HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false,
        }),
      });
      const data = await response.json();
      return data.response ?? "{}";
    }
  }

  /**
   * Safely parse and validate JSON model output. Accepts either an object or a string.
   * If parsing/validation fails, logs the error and returns a safe default object.
   */
  private safeParseJson(raw: any, schemaShape: any) {
    const schema = z.object(schemaShape);
    let parsed: any = raw;
    if (typeof raw === "string") {
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        console.error("AI response JSON.parse failed:", err, "raw:", raw?.slice?.(0, 100) ?? raw);
        parsed = {};
      }
    }

    try {
      const validated = schema.parse(parsed ?? {});
      return validated;
    } catch (err) {
      console.error("AI response validation failed:", err, "parsed:", parsed);
      // Return a minimal safe structure matching expected keys to avoid crashes downstream
      const safe: any = {};
      Object.keys(schemaShape).forEach((k) => {
        safe[k] = undefined;
      });
      return safe;
    }
  }

  private toHtml(schema: any): string {
    const sections = schema.sections ?? [];
    return `<section>
      <h1>${schema.summary ?? ""}</h1>
      ${sections
        .map(
          (section: any) => `<article>
            <h2>${section.heading}</h2>
            <ul>
              ${(section.bullets ?? []).map((bullet: string) => `<li>${bullet}</li>`).join("")}
            </ul>
          </article>`,
        )
        .join("")}
    </section>`;
  }

  private coverLetterToHtml(schema: any): string {
    return `<article>
      <p>${schema.greeting ?? "Dear Hiring Manager"},</p>
      ${schema.opening ? `<p>${schema.opening}</p>` : ""}
      ${(schema.body ?? []).map((paragraph: string) => `<p>${paragraph}</p>`).join("")}
      ${schema.closing ? `<p>${schema.closing}</p>` : ""}
      <p>${schema.signature ?? "Sincerely"}</p>
    </article>`;
  }
}
