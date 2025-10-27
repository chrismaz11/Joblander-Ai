import { generateCoverLetterVariants } from "./aiService.js";

export async function buildCoverLetter(payload) {
  const variants = await generateCoverLetterVariants(payload);
  return {
    tone: payload.tone ?? "professional",
    variants,
    content: variants[payload.tone ?? "professional"] ?? "",
  };
}
