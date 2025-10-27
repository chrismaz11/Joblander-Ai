import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  console.log('🚀 Creating job_lander database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }
  
  // Connect to template1 database (always exists)
  const originalUrl = process.env.DATABASE_URL;
  const defaultUrl = originalUrl.replace('/job_lander', '/template1');
  
  console.log('Connecting to:', defaultUrl.replace(/:[^:@]*@/, ':****@'));
  
  const sql = postgres(defaultUrl);
  
  try {
    // Create the database
    await sql`CREATE DATABASE job_lander`;
    console.log('✅ Database job_lander created successfully');
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log('✅ Database job_lander already exists');
    } else {
      console.error('❌ Failed to create database:', error.message);
      process.exit(1);
    }
  }
  
  await sql.end();
  process.exit(0);
}

main().catch(console.error);
