# 🔄 Database Migration Guide

This directory contains tools for migrating from MongoDB Atlas to AWS DynamoDB via Amplify GraphQL API.

## 📋 Overview

The migration process moves data from your MongoDB Atlas instance to the new AWS DynamoDB tables through the Amplify GraphQL API. This ensures data consistency and proper validation.

### Migration Targets:
- **Resumes** → DynamoDB Resume table
- **Job Applications** → DynamoDB JobApplication table  
- **Portfolios** → DynamoDB Portfolio table
- **User Settings** → DynamoDB UserSettings table

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install mongodb
```

### 2. Configure Migration
Copy the environment template:
```bash
cp migration/.env.example migration/.env
```

Edit `migration/.env` with your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourdb
DB_NAME=jobLander
BATCH_SIZE=10
DRY_RUN=true
```

### 3. Run Dry Run (Recommended)
```bash
cd migration
npx tsx database-migration.ts --dry-run
```

### 4. Run Actual Migration
```bash
cd migration
DRY_RUN=false npx tsx database-migration.ts
```

## 📊 Migration Process

### Data Mapping

#### Resume Records
```javascript
MongoDB → DynamoDB
{
  _id: "..." → id: "auto-generated"
  userId: "..." → userId: "..."
  content: {...} → content: {...}  // JSON field
  templateId: "..." → templateId: "..."
  canvaDesignId: "..." → canvaDesignId: "..."
  pdfUrl: "..." → pdfUrl: "..."
  blockchainHash: "..." → blockchainHash: "..."
  verifiedAt: Date → verifiedAt: ISO string
  createdAt: Date → createdAt: ISO string
  updatedAt: Date → updatedAt: ISO string
}
```

#### Job Application Records
```javascript
MongoDB → DynamoDB
{
  _id: "..." → id: "auto-generated"
  userId: "..." → userId: "..."
  resumeId: "..." → resumeId: "..."
  jobTitle: "..." → jobTitle: "..."
  company: "..." → company: "..."
  jobDescription: "..." → jobDescription: "..."
  applicationStatus: "..." → applicationStatus: ENUM
  appliedAt: Date → appliedAt: ISO string
  notes: "..." → notes: "..."
  matchScore: 0.95 → matchScore: 0.95
  coverLetter: {...} → coverLetter: {...}  // JSON field
}
```

## 🛠️ Advanced Usage

### Command Line Options
```bash
# Specify MongoDB URI directly
npx tsx database-migration.ts mongodb://localhost:27017 jobLander 20

# With environment variables
MONGODB_URI=mongodb://... DB_NAME=mydb BATCH_SIZE=50 npx tsx database-migration.ts

# Dry run only
npx tsx database-migration.ts --dry-run
```

### Programmatic Usage
```typescript
import { DatabaseMigrator } from './database-migration';

const migrator = new DatabaseMigrator({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'jobLander',
  batchSize: 20,
  dryRun: false,
});

await migrator.run();
```

## 🔍 Monitoring & Troubleshooting

### Migration Stats
The migration provides detailed statistics:
- Total records found
- Successfully migrated records
- Error records with details
- Migration duration and success rate

### Common Issues

#### 1. Authentication Errors
```
Error: Authentication failed
```
**Solution**: Ensure your MongoDB Atlas user has read permissions and IP whitelist is configured.

#### 2. GraphQL Errors
```
Error: GraphQL error: Access denied
```
**Solution**: Verify your Amplify API key has proper permissions.

#### 3. Field Mapping Errors
```
Error: Required field missing
```
**Solution**: Check that your MongoDB documents have required fields like `userId`.

### Data Validation

The migration includes automatic data validation:
- **Required Fields**: Ensures all required fields are present
- **Type Conversion**: Converts dates to ISO strings
- **Enum Validation**: Validates enum fields against allowed values
- **JSON Structure**: Validates JSON fields are properly formatted

## 🔧 Configuration Options

### Environment Variables
- `MONGODB_URI`: Source MongoDB connection string
- `DB_NAME`: Source database name  
- `BATCH_SIZE`: Number of records to process at once (default: 10)
- `DRY_RUN`: Run without making changes (default: true)

### Batch Processing
The migration processes records in batches to:
- Reduce memory usage
- Provide progress updates
- Allow for graceful error handling
- Enable restart capabilities

## 📈 Performance Tips

1. **Batch Size**: Start with 10, increase to 50-100 for large datasets
2. **Network**: Run from same region as MongoDB Atlas
3. **Indexing**: Ensure proper indexes on `userId` fields
4. **Monitoring**: Watch CloudWatch logs for API throttling

## 🔄 Post-Migration

After successful migration:
1. ✅ Verify data integrity with sample queries
2. ✅ Test application functionality 
3. ✅ Update connection strings in your app
4. ✅ Monitor performance and costs
5. ✅ Consider archiving MongoDB data

## 🚨 Rollback Plan

If issues occur:
1. Keep MongoDB Atlas running during initial testing
2. Use DynamoDB backups (enabled by default)
3. Re-run migration with corrected mappings
4. Test thoroughly before MongoDB Atlas cleanup

---

📞 **Need Help?** Check the migration logs and AWS CloudWatch for detailed error information.