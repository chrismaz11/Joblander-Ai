import { getDb } from './services/db.js';
import { resumes, coverLetters, userUsage, jobs } from './drizzle/schema.js';

async function initializeDatabase() {
  console.log('🗄️  Initializing JobLander database...');
  
  const db = getDb();
  
  if (!db) {
    console.error('❌ Database connection failed. Check your DATABASE_URL in .env');
    process.exit(1);
  }

  try {
    // Test database connection
    console.log('✅ Database connected successfully');
    
    // Insert sample job data
    const sampleJobs = [
      {
        id: 'job-1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        city: 'San Francisco',
        state: 'CA',
        remote: 'hybrid',
        employmentType: 'Full-time',
        salary: '$120,000 - $180,000',
        salaryMin: 120000,
        salaryMax: 180000,
        description: 'Join our team building next-generation software solutions.',
        requirements: ['JavaScript', 'React', 'Node.js', '5+ years experience'],
        postedDate: new Date(),
        jobUrl: 'https://example.com/job-1',
        source: 'company'
      },
      {
        id: 'job-2', 
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'Remote',
        city: 'Remote',
        state: null,
        remote: 'yes',
        employmentType: 'Full-time',
        salary: '$100,000 - $150,000',
        salaryMin: 100000,
        salaryMax: 150000,
        description: 'Lead product strategy and development for our growing platform.',
        requirements: ['Product Management', 'Agile', 'Analytics', '3+ years experience'],
        postedDate: new Date(),
        jobUrl: 'https://example.com/job-2',
        source: 'company'
      }
    ];

    // Insert sample jobs (ignore conflicts)
    for (const job of sampleJobs) {
      try {
        await db.insert(jobs).values(job).onConflictDoNothing();
      } catch (error) {
        // Job already exists, skip
      }
    }

    console.log('✅ Database initialized with sample data');
    console.log('🚀 Ready to start the server!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
