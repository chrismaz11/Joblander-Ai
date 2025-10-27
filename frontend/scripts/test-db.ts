import { db, testConnection } from '../server/db';
import { users } from '../shared/schema';

async function main() {
  console.log('🔍 Testing database connection...');
  
  const connected = await testConnection();
  
  if (connected) {
    console.log('✅ Database connection successful!');
    
    try {
      // Test a simple query
      const result = await db.select().from(users).limit(1);
      console.log('✅ Database query test successful');
      console.log('📊 Database info:');
      console.log('- Host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]);
      console.log('- Tables ready for migration');
    } catch (error) {
      console.log('⚠️  Database connected but tables not yet created');
      console.log('💡 Run: npm run db:migrate');
    }
  } else {
    console.log('❌ Database connection failed');
    console.log('💡 Check your DATABASE_URL in .env file');
  }
  
  process.exit(0);
}

main().catch(console.error);
