import process from "node:process";
import { z } from "zod";

const ConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(24),
  OPENAI_API_KEY: z.string().min(10),
  OLLAMA_HOST: z.string().url().optional(),
  FIGMA_ACCESS_TOKEN: z.string().optional(),
  FIGMA_FILE_ID: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().min(10),
  STRIPE_WEBHOOK_SECRET: z.string().min(10),
  APIFY_TOKEN: z.string().optional(),
  APIFY_INDEED_ACTOR_ID: z.string().optional(),
  APIFY_REMOTEOK_ACTOR_ID: z.string().optional(),
  BASE44_BUCKET: z.string().optional(),
  BASE44_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  API_BASE_URL: z.string().url().optional()
});

export type AppConfig = z.infer<typeof ConfigSchema>;

let cachedConfig: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig;
  }
  const parsed = ConfigSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.toString()}`);
  }
  cachedConfig = parsed.data;
  return cachedConfig;
}
