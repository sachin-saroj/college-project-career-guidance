# Developer Guide

Welcome to the CareerSathi engineering team! This guide explains our development workflow, standards, and how to add new features.

## Local Development Setup

1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   cd careersathi
   # Install backend dependencies
   cd backend && npm install
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

2. **Environment Variables**:
   Copy the `.env.example` to `.env` in both `frontend/` and `backend/` directories.
   Ensure you have valid keys for MongoDB, Redis, Google Gemini, and Cloudinary.

3. **Running the Stack**:
   Run the backend:
   ```bash
   cd backend
   npm run dev
   ```
   Run the frontend in a separate terminal:
   ```bash
   cd frontend
   npm run dev
   ```

## Folder Structure

```
careersathi/
├── backend/
│   ├── src/
│   │   ├── config/       # Environment & DB setup
│   │   ├── middlewares/  # Express middlewares (Auth, Error, Cache)
│   │   ├── modules/      # Domain-driven feature modules (Auth, Assessment, etc.)
│   │   │   └── {module}/
│   │   │       ├── controllers/
│   │   │       ├── routes/
│   │   │       ├── services/
│   │   │       └── models/
│   │   ├── utils/        # Helper functions
│   │   └── app.ts        # Express App setup
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instances and interceptors
│   │   ├── components/   # Reusable UI components
│   │   ├── modules/      # Domain-specific components and API hooks
│   │   ├── pages/        # Route components (lazy loaded)
│   │   ├── store/        # Zustand global state
│   │   ├── theme/        # MUI theme definitions
│   │   └── App.tsx       # Root component
└── docs/               # Project documentation
```

## Coding Standards

### TypeScript
- Always use strict typing.
- Avoid using `any`. Use `unknown` if a type is truly dynamic, then narrow it.
- Use Interfaces for object shapes and Types for unions/intersections.

### API & Backend
- **Validation**: All incoming requests MUST be validated using `zod` schemas in the route definition.
- **Controllers**: Controllers should only handle parsing requests, calling services, and returning responses. Do not put business logic in controllers.
- **Error Handling**: Throw `AppError` from services. The global error handling middleware will catch it and format the response.

### Frontend
- **State Management**: Use `React Query` for server state (data fetching, caching). Use `Zustand` for client state (UI toggles).
- **Components**: Use functional components. Destructure props.
- **Performance**: Use `React.memo` for heavy components that receive the same props. Use `React.lazy` for route splitting.

## Testing Workflow

We use **Jest** and **Supertest** for the backend, and **Vitest** + **Testing Library** for the frontend.

To run tests:
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```
Write tests for any new features or bug fixes.

## Creating a New API Endpoint

1. Define the Mongoose Model (if applicable).
2. Create Zod validation schemas.
3. Write the Service logic.
4. Write the Controller.
5. Define the Route and attach the validation middleware and controller.
6. Write unit tests for the Service and e2e tests for the Route.
