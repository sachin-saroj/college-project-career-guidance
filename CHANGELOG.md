# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-26

### Added
- **Core Platform**: Registration, Authentication (JWT + Cookies), Password Reset.
- **Student Dashboard**: Personalized dashboard showing recent assessments, saved careers, and active mentors.
- **AI Assessment Engine**: Multi-stage psychometric assessments covering Aptitude, Interest, and Personality.
- **Recommendation Engine**: Dynamic career recommendations matching student profiles with up-to-date career pathways.
- **AI Mentor (Gemini Integration)**: Conversational chat interface for context-aware, 24/7 career guidance.
- **Resource Library**: Centralized repository of courses, scholarships, and roadmaps with robust filtering and search.
- **Resume & Portfolio Builder**: PDF generation, dynamic templates, and sharable portfolio URLs.
- **Admin Dashboard**: Comprehensive CMS for managing users, resources, careers, and platform analytics.
- **Security**: Advanced security middleware (Helmet, CORS, Rate Limiting, Data Sanitization).
- **Performance**: Route-level code splitting, manual chunking, Redis caching, optimized Mongoose pooling.
- **Observability**: Winston structured logging and Sentry error tracking / profiling.
- **Infrastructure**: Multi-stage Dockerfiles and `docker-compose.yml` for Nginx, MongoDB, and Redis.
- **CI/CD**: GitHub Actions workflows for continuous integration and continuous deployment.

### Fixed
- N/A (Initial Release)

### Security
- Comprehensive API validation using Zod.
- Secure, HTTP-only cookies for authentication.
- Strict Content Security Policy via Helmet.
- Implemented global rate limiting to prevent brute force and DoS attacks.
