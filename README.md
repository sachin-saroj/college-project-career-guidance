# CareerSathi - Online Career Guidance Portal

CareerSathi is a comprehensive online career guidance portal designed specifically for underprivileged students. It bridges the gap in career awareness, mentoring, and skill-building through a unified platform powered by AI.

![CareerSathi Banner](https://via.placeholder.com/1200x400?text=CareerSathi+Banner)

## 🌟 Features

- **AI-Powered Career Assessment**: Multi-dimensional psychometric tests measuring aptitude, interest, and personality.
- **Smart Recommendations**: Algorithmic mapping to suitable career paths with confidence scores.
- **AI Mentorship**: A built-in AI mentor powered by Google Gemini for 24/7 career advice.
- **Resume & Portfolio Builder**: Easy-to-use tools to build professional resumes and portfolios.
- **Curated Resources**: Extensive library of courses, scholarships, and career roadmaps.
- **Admin Dashboard**: Comprehensive CMS and user management with analytics.

## 🏗 Architecture

CareerSathi follows a modern, decoupled client-server architecture:
- **Frontend**: React 18, TypeScript, Vite, Material UI (MUI), Zustand, React Query.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Redis.
- **Infrastructure**: Docker, Nginx, GitHub Actions (CI/CD).
- **AI Integration**: Google Gemini Pro via the `@google/genai` SDK.

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+)
- MongoDB
- Redis (optional, for caching)
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sachin-saroj/college-project-career-guidance.git
   cd college-project-career-guidance
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env # Configure your environment variables
   npm run dev
   ```

## 🐳 Docker Setup

You can run the entire stack using Docker Compose:

```bash
docker-compose up --build -d
```
This will start the Nginx reverse proxy (port 80), Backend API (port 5000), MongoDB, and Redis.

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/careersathi
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_google_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_ENVIRONMENT=development
```

## 📚 Documentation

Detailed documentation can be found in the `/docs` directory:
- [API Documentation](docs/api.md)
- [Architecture Details](docs/architecture.md)
- [Database Schema](docs/database.md)
- [Developer Guide](docs/developer-guide.md)
- [User Manual](docs/user-manual.md)
- [Admin Manual](docs/admin-manual.md)
- [Operations Guide](docs/operations-guide.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
