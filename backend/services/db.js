import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../drizzle/schema.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

let database = null;
let sqlClient = null;
let initialized = false;

const SSL_CONFIG = { ssl: { rejectUnauthorized: false } };

export function getDb() {
  if (initialized) {
    return database;
  }

  initialized = true;

  const connectionString = process.env.DATABASE_URL;

  console.log('[db] DATABASE_URL:', connectionString ? 'Found' : 'Not found');

  if (!connectionString) {
    console.info(
      "[db] DATABASE_URL not provided. Falling back to in-memory storage.",
    );
    return null;
  }

  try {
    const shouldUseSSL = /\b(supabase\.co|render\.com|fly\.io)\b/.test(
      connectionString,
    );

    sqlClient = postgres(connectionString, shouldUseSSL ? SSL_CONFIG : {});
    database = drizzle(sqlClient, { schema });
    console.info("[db] Connected to Postgres via Drizzle.");
  } catch (error) {
    console.error("[db] Failed to initialize database connection:", error);
    database = null;
  }

  return database;
}

export function closeDb() {
  if (sqlClient) {
    sqlClient.end({ timeout: 5 }).catch(() => undefined);
  }
}
