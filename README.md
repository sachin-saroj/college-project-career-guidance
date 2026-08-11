<div align="center">

# 🎓 CareerSathi (करियर साथी) 
### *Empowering Underprivileged Students with Next-Gen AI Career Guidance*

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

> **CareerSathi** is an end-to-end, zero-cost, AI-powered career counseling and mentorship portal designed to bridge the opportunity gap for underprivileged and underrepresented students. Powered by Google Gemini 1.5 Flash, modern React 19, and a zero-setup Express architecture.

</div>

---

## 📸 Application Screenshots

<p align="center">
  <b>🔐 Authentication (Login Page)</b><br>
  <img src="docs/screenshots/login.png" alt="CareerSathi Login Page" width="100%">
</p>

<br>

<p align="center">
  <b>📊 Student Overview Dashboard</b><br>
  <img src="docs/screenshots/dashboard.png" alt="CareerSathi Dashboard" width="100%">
</p>

<br>

<p align="center">
  <b>🤖 AI Mentor Chat Hub</b><br>
  <img src="docs/screenshots/mentor.png" alt="CareerSathi AI Mentor" width="100%">
</p>

<br>

<p align="center">
  <b>🎯 Psychometric Career Assessment Engine</b><br>
  <img src="docs/screenshots/assessment.png" alt="CareerSathi Assessment" width="100%">
</p>

<br>

<p align="center">
  <b>📚 Scholarships, Courses & Internships Hub</b><br>
  <img src="docs/screenshots/resources.png" alt="CareerSathi Resources" width="100%">
</p>

<br>

<p align="center">
  <b>📄 AI Resume Builder & ATS Reviewer</b><br>
  <img src="docs/screenshots/resume.png" alt="CareerSathi Resume Builder" width="100%">
</p>

<br>

<p align="center">
  <b>👤 Student Profile & Skill Badges</b><br>
  <img src="docs/screenshots/profile.png" alt="CareerSathi Profile" width="100%">
</p>

<br>

<p align="center">
  <b>⚙️ User Preferences & Settings</b><br>
  <img src="docs/screenshots/settings.png" alt="CareerSathi Settings" width="100%">
</p>

---

## 📋 Table of Contents

- [📸 Application Screenshots](#-application-screenshots)
- [✨ Overview & Problem Statement](#-overview--problem-statement)
- [🚀 Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
  - [High-Level Data Flow](#high-level-data-flow)
  - [Request Lifecycle Diagram](#request-lifecycle-diagram)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Repository Structure](#-repository-structure)
- [📥 Quick Start & Local Setup](#-quick-start--local-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend v2 Setup](#2-frontend-v2-react--vite-setup)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🎨 Design Aesthetics & UI System](#-design-aesthetics--ui-system)
- [🔒 Security & Data Privacy](#-security--data-privacy)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🗺️ Future Roadmap](#️-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Overview & Problem Statement

### The Problem
Access to professional career counseling, resume optimization, and personalized skill roadmaps is often expensive, centralized in urban hubs, or out of reach for students from low-income or underprivileged backgrounds. As a result, millions of talented students miss out on scholarships, modern tech careers, and career growth opportunities.

### The Solution: CareerSathi
CareerSathi democratizes career counseling by providing an intelligent, personalized, and 100% free AI guidance ecosystem:
1. **Psychometric AI Assessment**: Dynamically evaluates aptitude, soft skills, and personal background to generate tailored career trajectories.
2. **Context-Aware AI Mentor**: A continuous conversational companion that remembers the student's profile, education level, and career aspirations.
3. **Interactive Career Roadmaps**: Step-by-step visual learning paths for top modern professions (Software Engineering, Data Science, AI/ML, Cybersecurity, Cloud Architecture).
4. **AI Resume Builder & ATS Reviewer**: Instant resume scoring, text extraction from PDFs, ATS keyword matching, and PDF generation.
5. **Curated Free Resource Hub**: A centralized, searchable portal for scholarships, free courses, certifications, and mentorship initiatives.
6. **Unified Admin Console**: Complete management interface for resource updates, platform analytics, user role moderation, and real-time logs.

---

## 🚀 Key Features

| Feature Module | Capabilities |
| :--- | :--- |
| 📊 **Interactive Dashboard** | Real-time career match index, quick action shortcuts, active applications tracker, deadline countdowns, and skill progress widgets. |
| 🎯 **AI Career Assessment** | Multi-phase question engine evaluating logical reasoning, interest areas, and background to output structured career match analytics. |
| 🤖 **AI Mentor Chat Hub** | Real-time assistant powered by Gemini 1.5 Flash, equipped with preset prompts, context sidebar, syntax-highlighted responses, and model selection. |
| 🗺️ **Interactive Roadmaps** | Visual node-based learning tracks complete with estimated timeframes, prerequisite topics, recommended free resources, and PDF exports. |
| 📄 **Resume Builder & ATS** | PDF text extraction (`pdf-parse`), instant AI resume critique, skill keyword recommendations, live preview, and one-click PDF generation. |
| 📚 **Scholarship & Course Hub** | Categorized list of verified scholarships and free courses with filter controls, search, and bookmarking functionality. |
| 🛡️ **Admin Console** | System metrics, user management modal, resource editor, role management, and live activity log streams. |
| 🌓 **Modern UI/UX** | Dark/Light mode, custom Tailwind color tokens, glassmorphism card surfaces, and accessible responsive layouts. |

---

## 🏗️ System Architecture

CareerSathi utilizes a decoupled, modern client-server architecture:
- **Frontend (v2)**: Built with React 19, TypeScript, Vite, Tailwind CSS, Zustand, and Framer Motion for high-performance Single Page Application (SPA) delivery.
- **Frontend (v1)**: Lightweight Vanilla HTML5/JS client for low-bandwidth or legacy environments.
- **Backend API**: Node.js & Express server handling JWT authentication, request validation, and AI prompt engineering.
- **AI Core**: Google Gemini 1.5 Flash API wrapper for fast, context-driven natural language generation.
- **Zero-Setup Database**: In-memory JSON file system abstraction (`database.json`) enabling zero-configuration setup for immediate deployment and evaluation.

### High-Level Data Flow

```mermaid
graph TD
    User(["🎓 Student / User"]) -->|HTTP / REST| FrontendV2["React 19 + Vite Frontend SPA"]
    Admin(["🛡️ Admin"]) -->|REST API| FrontendV2
    
    subgraph Client Layer
        FrontendV2 -->|Auth State| Zustand["Zustand Store"]
        FrontendV2 -->|UI Routing| ReactRouter["React Router DOM v7"]
    end
    
    subgraph Express Backend Layer
        FrontendV2 -->|Bearer JWT Header| ExpressServer["Express.js Server :5000"]
        ExpressServer --> AuthMiddleware{"JWT Auth & RBAC"}
        AuthMiddleware -->|Validated| RouteHandlers["Unified API Router"]
    end

    subgraph "Service & Persistence Layer"
        RouteHandlers -->|Prompt Context| GeminiSDK["Google Gemini 1.5 Flash SDK"]
        RouteHandlers -->|Read / Write| LocalDB[("Local JSON Database")]
        GeminiSDK -->|Generative Output| RouteHandlers
    end
```

### Request Lifecycle Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Client as React 19 Frontend
    participant Server as Express Server
    participant Auth as Auth Middleware
    participant Router as Unified Router
    participant DB as JSON DB Storage
    participant Gemini as Google Gemini AI API

    Client->>Server: POST /api/chat (Prompt + Auth Token)
    Server->>Auth: Verify JWT Token
    Auth-->>Server: Token Verified (Attach userId)
    Server->>Router: Route to Chat Handler
    Router->>DB: Fetch User Profile & Saved Resume
    DB-->>Router: Return User Context Data
    Router->>Gemini: Inject Context + Prompt into Gemini Model
    Gemini-->>Router: Return AI Generated Analysis / Advice
    Router->>Server: Package Clean JSON Response
    Server-->>Client: HTTP 200 OK (Message Payload)
    Client->>Client: Render Markdown & Update UI State
```

---

## 🛠️ Tech Stack

### **Frontend (`frontend-v2`)**
- **Framework**: React 19.0.0
- **Language**: TypeScript 5.7+
- **Build Tool**: Vite 6.0+
- **Styling**: Tailwind CSS 3.4+, Vanilla CSS Variables
- **Icons**: Lucide React
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF, html2canvas

### **Backend (`backend`)**
- **Runtime**: Node.js 18+ / 20+
- **Framework**: Express.js 4.21+
- **Module System**: ES Modules (`"type": "module"`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Input Validation**: Zod schema validation middleware
- **File Parsing**: `multer`, `pdf-parse`
- **AI Integration**: `@google/generative-ai` (Gemini 1.5 Flash)
- **Security**: CORS, Rate Limiting (`express-rate-limit`), Environment variable isolation
- **API Docs**: Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)
- **Testing**: Vitest, Supertest

---

## 📂 Repository Structure

```text
Online Career Guidance Portal for Underprivileged Students/
├── backend/                              # Express Node.js API Server (ES Modules)
│   ├── middleware/                       # Authentication & Authorization
│   │   ├── index.js                     # JWT auth + Admin RBAC middleware
│   │   └── validate.js                  # Zod schema validation middleware
│   ├── tests/                           # Automated test suite
│   │   └── api.test.js                  # Vitest integration & auth tests
│   ├── .env.example                     # Template for backend environment variables
│   ├── database.json                    # Local JSON database file
│   ├── db.js                            # Simplified async getUsers/saveUsers (atomic writes)
│   ├── routes.js                        # Unified API router (all endpoints in one file)
│   ├── swagger.js                       # OpenAPI/Swagger specification
│   ├── package.json                     # Backend dependencies & scripts
│   └── server.js                        # Server entry point & CORS/rate-limit config
│
├── frontend-v2/                          # Modern React 19 + TypeScript SPA
│   ├── public/                           # Static public assets & branding logos
│   ├── src/
│   │   ├── assets/                       # Images, icons, static graphic files
│   │   ├── components/                   # UI Component Library
│   │   │   ├── dashboard/                # AIMentorCard, CareerMatchCard, StatCard, TaskTable...
│   │   │   ├── layout/                   # TopNavbar, Sidebar, CommandMenu, NotificationDrawer...
│   │   │   └── ui/                       # Button, Card, Badge, Input, Switch, Logo...
│   │   ├── context/                      # React Context providers (AuthContext)
│   │   ├── pages/                        # Page View Containers
│   │   │   ├── Admin/                    # Admin Dashboard & Console Modal
│   │   │   ├── Assessment/               # Landing, Question Engine, Processing, Results
│   │   │   ├── Auth/                     # Login & Signup screens
│   │   │   ├── Dashboard/                # Main Student Overview Dashboard
│   │   │   ├── Mentor/                   # AI Mentor Chat Area, Prompts, Context Panel
│   │   │   ├── Profile/                  # User Profile settings & skill badges
│   │   │   ├── Resources/                # Scholarship & Free Course Search Hub
│   │   │   ├── ResumeBuilder/            # Resume Form Builder & PDF Analyzer
│   │   │   ├── Roadmaps/                 # Interactive Career Skill Roadmaps
│   │   │   └── Settings/                 # Preferences & Theme toggles
│   │   ├── store/                        # Global state management via Zustand
│   │   ├── App.tsx                       # App Router & Layout Shell
│   │   ├── index.css                     # Design System CSS, Tailwind imports, themes
│   │   └── main.tsx                      # React root rendering entry point
│   ├── package.json                      # Frontend dependencies & scripts
│   ├── tailwind.config.js                # Tailwind theme customization & tokens
│   ├── tsconfig.json                     # TypeScript compiler configuration
│   └── vite.config.ts                    # Vite build & plugin configurations
│
├── docs/                                 # Documentation & assets
│   └── screenshots/                      # Application screenshots for README
├── frontend/                             # Legacy Vanilla JS Frontend (v1 fallback)
└── README.md                             # Comprehensive Project Documentation
```

---

## 📥 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Free key available from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file in the `backend` directory:
   ```bash
   cp .env.example .env
   ```
   *Or create it manually with the following content:*
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_careersathi_2026
   GEMINI_API_KEY=your_actual_google_gemini_api_key_here
   ```

4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   *The backend server will run on **`http://localhost:5000`**.*

5. Run the test suite:
   ```bash
   npm test
   ```

---

### 2. Frontend v2 (React + Vite) Setup

1. Open a new terminal window and navigate to `frontend-v2`:
   ```bash
   cd frontend-v2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | ❌ No | `5000` | Port number on which the Express server listens. |
| `JWT_SECRET` | ✅ Yes | - | Secret string used to sign and verify authentication JSON Web Tokens. |
| `GEMINI_API_KEY` | ✅ Yes | - | API key obtained from Google AI Studio for Gemini 1.5 Flash SDK calls. |

---

## 📡 API Documentation

> **Interactive API Docs**: Start the backend server and visit **[http://localhost:5000/api/docs](http://localhost:5000/api/docs)** for the live Swagger UI.

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user, hashes password, returns JWT token. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, returns JWT token. |
| `GET` | `/api/auth/me` | Protected | Fetches authenticated user's profile and progress metrics. |
| `POST` | `/api/auth/change-password` | Protected | Updates the authenticated user's password. |

### 🤖 AI Mentor & Assessment Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/chat` | Protected | Sends user prompt + context to Gemini API, returns AI response. |
| `GET` | `/api/assessment` | Protected | Fetches psychometric assessment questions. |
| `POST` | `/api/assessment/submit` | Protected | Processes quiz responses and generates career match analytics. |

### 👤 Profile Endpoints (`/api/profile`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/profile` | Protected | Retrieves the authenticated user's profile data. |
| `PUT` | `/api/profile` | Protected | Updates profile fields (education, skills, interests, etc.). |
| `DELETE` | `/api/profile` | Protected | Permanently deletes the user's account. |

### 📄 Resume Endpoints (`/api/resume`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/resume/upload` | Protected | Accepts PDF upload (`multipart/form-data`), extracts text, returns AI feedback. |
| `PUT` | `/api/resume` | Protected | Saves resume JSON data to user profile. |
| `POST` | `/api/resume/analyze` | Protected | Runs AI ATS analysis on resume data, returns score and suggestions. |
| `POST` | `/api/resume/rewrite` | Protected | Rewrites a resume section with AI for professional impact. |

### 📚 Resource & Dashboard Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/resources` | Protected | Lists all curated scholarships, courses, and learning resources. |
| `GET` | `/api/resources/search?q=...` | Protected | Searches resources by title, description, skills, or category. |
| `GET` | `/api/resources/bookmarks` | Protected | Fetches user's bookmarked resources. |
| `POST` | `/api/resources/bookmarks` | Protected | Bookmarks a resource by ID. |
| `DELETE` | `/api/resources/bookmarks/:id` | Protected | Removes a resource bookmark. |
| `GET` | `/api/resources/:id` | Protected | Fetches a single resource by ID. |
| `GET` | `/api/dashboard` | Protected | Fetches user dashboard with tasks, profile completion, and recommendations. |
| `GET` | `/api/dashboard/stats` | Protected | Fetches aggregated user metrics and progress statistics. |

### 🛡️ Admin Endpoints (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/admin/users` | Admin | Retrieves list of all registered users. |
| `PUT` | `/api/admin/users/:id/role` | Admin | Updates a user's role (user/admin). |
| `DELETE` | `/api/admin/users/:id` | Admin | Deletes a user by ID. |
| `POST` | `/api/admin/resources` | Admin | Adds a new scholarship or educational resource. |
| `PUT` | `/api/admin/resources/:id` | Admin | Updates an existing resource. |
| `DELETE` | `/api/admin/resources/:id` | Admin | Removes a resource by ID. |
| `GET` | `/api/admin/export` | Admin | Exports the full database as JSON download. |
| `POST` | `/api/admin/import` | Admin | Imports and restores a database JSON payload. |

---

## 🎨 Design Aesthetics & UI System

CareerSathi follows strict, high-end web design principles designed to inspire confidence and ease of use:
- **Palette**: Deep slate dark backgrounds (`#0B0F19`), vibrant primary indigo/purple accents (`#6366F1`, `#8B5CF6`), soft glassmorphism surface layers (`rgba(255, 255, 255, 0.05)`).
- **Typography**: Clean, readable sans-serif layout powered by Inter / System fonts with balanced leading.
- **Interactivity**: Micro-animations on hover, smooth transitions via Framer Motion, skeleton loaders during AI generation states.
- **Accessibility**: High-contrast text ratios, clear focus indicators, full keyboard command menu (`Ctrl + K`).

---

## 🔒 Security & Data Privacy

1. **Password Safety**: Passwords are hashed using `bcryptjs` with salt round factors (cost ≥ 10) before saving to database storage.
2. **Stateless JWT Authorization**: Sensitive routes require a valid `Bearer <token>` HTTP header verified on every request.
3. **Role-Based Protection**: Admin endpoints enforce strict role checks returning `403 Forbidden` for non-authorized attempts.
4. **Input Validation**: All user inputs are validated with Zod schemas before processing to prevent injection and malformed data.
5. **Rate Limiting**: Auth endpoints (20 req/15min), AI endpoints (30 req/15min), and general API (200 req/15min) are rate-limited.
6. **Atomic Database Writes**: Database writes use a temp-file + rename strategy to prevent data corruption during concurrent writes.
7. **Environment Isolation**: API keys and secrets are isolated inside `.env` and never exposed in client bundles.

---

## ⚡ Performance Optimizations

- **Route-Level Code Splitting**: All page components are lazily loaded via `React.lazy()` and `Suspense`, keeping the initial bundle size minimal.
- **Vite Chunk Optimization**: Frontend bundles are modularized using Vite's dynamic imports for optimal caching.
- **Unified Backend Router**: All API routes consolidated into a single ES module file, reducing import overhead and simplifying maintenance.
- **In-Memory File Parsing**: PDF resume extractions parse directly from RAM buffers (`multer.memoryStorage()`) without writing temporary files to disk.
- **Prompt Engineering Truncation**: Resume text content is normalized and capped at optimal token length to ensure rapid 1-2 second responses from Gemini 1.5 Flash.

---

## 🗺️ Future Roadmap

- [x] Complete React 19 + TypeScript + Vite modern migration (`frontend-v2`).
- [x] Interactive step-by-step career roadmaps with downloadable guides.
- [x] Full-stack Admin Console with user role management.
- [x] Zod input validation middleware for all API endpoints.
- [x] OpenAPI/Swagger interactive API documentation.
- [x] Automated test suite with Vitest.
- [x] Codebase simplification — unified routes, middleware, and streamlined DB layer.
- [ ] MongoDB Atlas / PostgreSQL database driver connection layer.
- [ ] Multi-language support (Hindi, Marathi, Tamil, Bengali) for regional accessibility.
- [ ] Direct Mentor-Student video integration and scheduling system.

---

## 🤝 Contributing

We welcome contributions from students, developers, and educators!

1. **Fork** the repository.
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/AwesomeFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: Add AwesomeFeature"
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/AwesomeFeature
   ```
5. **Open** a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more details.

<br />

<div align="center">
  <b>CareerSathi — Bridging the Gap in Education with Generative AI</b><br />
  <i>Built with ❤️ for Underprivileged Students Worldwide</i>
</div>
