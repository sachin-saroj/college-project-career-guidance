# System Architecture

CareerSathi is designed as a modular, decoupled application consisting of a React-based Single Page Application (SPA) on the frontend and an Express-based REST API on the backend.

## High-Level Diagram

```mermaid
graph TD
    Client[Client Browser (React SPA)] -->|HTTPS / REST API| Nginx[Nginx Reverse Proxy]
    Nginx -->|Proxy Pass| Backend[Express.js Node Backend]
    
    Backend -->|Mongoose| MongoDB[(MongoDB)]
    Backend -->|ioredis| Redis[(Redis Cache)]
    Backend -->|Gemini SDK| GeminiAPI[Google Gemini API]
    Backend -->|Cloudinary SDK| Cloudinary[Cloudinary CDN]
```

## Frontend Architecture

The frontend is built using **React 18** and **Vite**.

- **Routing**: Handled by `react-router-dom`. Routes are code-split using `React.lazy` and `<Suspense>` for performance.
- **State Management**: 
  - **Server State**: Managed via `@tanstack/react-query` with configured garbage collection (`gcTime`) to cache API responses.
  - **Client State**: Managed via `zustand` for lightweight, global UI state (e.g., theme, sidebar toggles).
- **UI Components**: Built using **Material UI (MUI)** for consistent, accessible components.
- **Forms & Validation**: Managed using `react-hook-form` and `zod` schema validation.
- **Styling**: Emotion (CSS-in-JS via MUI) and basic CSS modules.

## Backend Architecture

The backend is a **Node.js** service running **Express**.

- **Structure**: Modular architecture organized by business domains (e.g., `auth`, `assessment`, `mentor`, `resources`).
- **Layers**:
  - **Routes**: Define API endpoints and apply middleware.
  - **Controllers**: Handle HTTP request/response logic.
  - **Services**: Contain core business logic.
  - **Models**: Mongoose schemas interacting with MongoDB.
- **Validation**: Request payloads are validated at the route level using `zod`.
- **Caching**: A Redis caching layer (`cache.middleware.ts`) wraps read-heavy routes to reduce database load.

## Database Strategy (MongoDB)

- **Collections**: `users`, `assessments`, `careers`, `resources`, `resumes`, `portfolios`.
- **Indexing**: Compound indexes are used for complex queries (e.g., `{ role: 1, createdAt: -1 }` on Users).
- **Transactions**: Multi-document operations (like submitting an assessment and saving the result) use Mongoose transactions to ensure ACID compliance.

## AI Integration (Google Gemini)

The AI Mentor feature leverages the **Google Gemini API** (`@google/genai`).
- The backend constructs a prompt injecting the user's assessment profile, career goals, and chat history.
- The prompt is sent to Gemini, which returns a markdown-formatted response.
- Responses are streamed or returned synchronously to the client.

## Infrastructure & DevOps

- **Dockerization**: Both frontend and backend use multi-stage Docker builds. The frontend is built into static files and served by an Nginx container.
- **Reverse Proxy**: Nginx handles incoming HTTP traffic, routes `/api/` to the backend container, and serves static files for the frontend. It also manages GZIP compression and security headers.
- **CI/CD**: GitHub Actions handle automated linting, type-checking, testing, and Docker image builds upon push to `main` or `develop`.
