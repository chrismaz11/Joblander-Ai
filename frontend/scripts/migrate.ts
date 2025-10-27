import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../server/db';
import postgres from 'postgres';

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  console.log('🚀 Running database migrations...');
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
  
  await migrationClient.end();
  process.exit(0);
}

main();
