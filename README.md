# CareerSathi - AI Career Guidance Portal

CareerSathi is a clean, minimal, and fully functional career guidance portal designed specifically for underprivileged students. It leverages Google's Gemini AI to act as a personalized career counselor and resume reviewer.

## Architecture & Design Philosophy
This project was built over a structured 10-phase engineering sprint with a strict **Zero-Setup Philosophy**. It is optimized for college project submissions and rapid learning. 
- **Frontend**: Pure Vanilla HTML, CSS (Bootstrap 5), and JavaScript. No complex build tools like Webpack or React.
- **Backend**: Lightweight Node.js + Express server.
- **Database**: Local JSON file (`backend/database.json`) utilizing the native `fs` module for persistence. No MongoDB or external cloud databases required.

## Key Features
1. **JWT Authentication**: Secure user registration and login flows.
2. **Dynamic Student Profiles**: Students can document their education, skills, interests, career goals, and family income for scholarships.
3. **AI Career Assessment**: A robust quiz that dynamically generates personalized career roadmaps and matches using the Gemini API.
4. **AI Resume Builder & Analyzer**: Students can generate clean, ATS-friendly PDF resumes client-side (via html2pdf) and receive AI-driven feedback to improve their CVs.
5. **Role-Based Admin Dashboard**: A comprehensive admin panel to manage registered students and dynamically update the platform's resources (courses, scholarships, articles).
6. **Smart Dashboard**: A personalized hub featuring real-time status trackers for profile completion and assessment tracking.

## Getting Started
Please see the [Setup Guide](docs/setup-guide.md) for detailed instructions on running the project locally.

## Admin Access
To test the admin features, register an account with the exact email: `admin@careersathi.com`. This will automatically elevate your privileges and grant access to the Admin Panel.

## Credits
Built as a comprehensive 10-phase engineering project by Antigravity.
