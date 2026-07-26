# Operations Guide

This guide is for DevOps engineers and system administrators responsible for deploying, scaling, and maintaining the CareerSathi platform in production.

## 1. Deployment Architecture

The application is deployed using Docker Compose on a single VM (or managed Kubernetes for larger scale).
- **Nginx**: Acts as the edge reverse proxy. Terminates SSL (if configured), serves static frontend files, and proxies `/api` requests to the Node.js backend.
- **Node Backend**: Stateless Express application. Can be horizontally scaled.
- **MongoDB**: The primary persistent datastore.
- **Redis**: In-memory cache for API rate limiting and response caching.

## 2. Environment Variables

Always inject environment variables at runtime via a `.env` file or CI/CD secrets.
**Critical Secrets**:
- `JWT_SECRET`: Must be a long, cryptographically secure random string.
- `MONGO_URI`: Use strong authentication for the database.
- `GEMINI_API_KEY`: API key for Google's AI services.
- `SENTRY_DSN`: Required for production crash reporting and telemetry.

## 3. Docker Compose Operations

Start the production stack:
```bash
docker-compose up --build -d
```

View logs:
```bash
docker-compose logs -f
# Or specific service
docker-compose logs -f backend
```

Restart a service:
```bash
docker-compose restart nginx
```

Stop the stack (preserves volumes):
```bash
docker-compose down
```

## 4. Monitoring & Logging

- **Logging**: The backend uses Winston. Logs are output to `stdout` in JSON format in production. You can ingest these using a tool like Datadog, ELK, or CloudWatch.
- **Error Tracking**: Sentry is integrated via `@sentry/node`. It automatically captures unhandled exceptions, unhandled promise rejections, and performance profiles.
- **Health Checks**: The backend exposes a `/api/v1/health` endpoint. Configure your load balancer or uptime monitor (e.g., UptimeRobot) to ping this endpoint.

## 5. Backups and Restoration

**MongoDB Backups**:
Create a daily cron job that runs `mongodump`:
```bash
docker exec careersathi-mongo mongodump --archive=/data/backups/db-backup-$(date +%F).archive
```

**Restoration**:
```bash
docker exec -i careersathi-mongo mongorestore --archive < /path/to/backup.archive
```

## 6. Continuous Integration & Deployment (CI/CD)

The repository contains GitHub Actions workflows in `.github/workflows/`:
- **`ci.yml`**: Runs on every Pull Request. Executes `npm run lint`, `npm run typecheck`, and `npm run test` for both frontend and backend.
- **`cd.yml`**: Runs on push to `main`. Builds the Docker images and tags them. (Can be extended to push to Docker Hub/ECR and trigger a server webhook for deployment).
