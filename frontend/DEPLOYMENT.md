# Job-Lander Deployment Guide

This guide covers deploying Job-Lander using Docker for both development and production environments.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- API keys for external services (optional, defaults provided for testing)

## Quick Start with Docker

### 1. Environment Setup

Copy the example environment file and customize if needed:
```bash
cp .env.example .env
```

The application includes sensible defaults for development, so you can start immediately without API keys.

### 2. Start with Docker Compose

Build and start all services:
```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL database on port 5432
- Build and run the Job-Lander application on port 3000
- Set up persistent data storage

### 3. Access the Application

- **Application**: http://localhost:3000
- **Database**: postgresql://postgres:password@localhost:5432/joblander

### 4. Stop the Services

```bash
docker-compose down
```

To remove all data (including database):
```bash
docker-compose down -v
```

## Local Development (Without Docker)

If you prefer to run the application locally:

### 1. Database Setup

Start just the PostgreSQL container:
```bash
docker run -d --name postgres-dev \
  -e POSTGRES_DB=joblander \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Ensure your `.env` file has:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/joblander"
PORT=3000
NODE_ENV="development"
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Environment Variables

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session management

### Optional API Keys (Demo values provided)
- `GEMINI_API_KEY`: Google AI API key for content generation
- `JSEARCH_API_KEY`: Job search API key
- `PRIVATE_KEY` & `CONTRACT_ADDRESS`: Blockchain verification (testnet)

## Production Deployment

### Docker Production Build

For production deployment, the same Docker setup can be used with environment variable updates:

1. **Set production environment variables**:
   ```bash
   export GEMINI_API_KEY="your-production-api-key"
   export DATABASE_URL="your-production-database-url"
   # ... other production values
   ```

2. **Update docker-compose.yml** for production:
   - Change database password
   - Set `NODE_ENV=production`
   - Configure proper domain names
   - Set up SSL/TLS certificates

3. **Deploy**:
   ```bash
   docker-compose up -d --build
   ```

### Cloud Deployment

The Docker setup is ready for deployment to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Any Docker-compatible hosting service

## Database Management

### Run Migrations

```bash
# With Docker Compose running:
docker-compose exec app npm run db:push

# Or locally:
npm run db:push
```

### Backup Database

```bash
docker-compose exec db pg_dump -U postgres joblander > backup.sql
```

### Restore Database

```bash
docker-compose exec -T db psql -U postgres joblander < backup.sql
```

## Troubleshooting

### Port Already in Use

If port 3000 is busy, update the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "4000:5000"  # External:Internal
```

### Database Connection Issues

1. Ensure PostgreSQL container is healthy:
   ```bash
   docker-compose ps
   ```

2. Check database connectivity:
   ```bash
   docker-compose exec db psql -U postgres -d joblander -c "SELECT 1;"
   ```

### Application Won't Start

1. Check logs:
   ```bash
   docker-compose logs app
   ```

2. Common issues:
   - Missing environment variables
   - Database not ready (wait for health check)
   - Port conflicts

### Build Issues

If you encounter build problems:

1. Clean build cache:
   ```bash
   docker-compose build --no-cache
   ```

2. Remove old images:
   ```bash
   docker system prune -f
   ```

## Health Monitoring

The application includes health check endpoints:
- **Application Health**: http://localhost:3000/api/health
- **System Metrics**: http://localhost:3000/health

## Scaling

For production scaling:
- Use a managed database service (RDS, Cloud SQL, etc.)
- Deploy multiple application instances behind a load balancer
- Use Redis for session storage in multi-instance deployments
- Configure CDN for static assets

## Security Considerations

- Change default database passwords
- Set strong session secrets
- Configure proper CORS settings
- Enable HTTPS in production
- Secure API keys and environment variables
- Regular security updates for base images

---

This deployment setup provides a solid foundation for both development and production use of Job-Lander.