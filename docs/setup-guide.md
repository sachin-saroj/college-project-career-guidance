# CareerSathi Setup Guide

Welcome to the CareerSathi project! This guide explains how to get the project running locally on your machine.

**Design Philosophy**: This project is intentionally built with a *zero-setup* philosophy. There is no external database like MongoDB to configure, no complex build steps like Webpack to run, and no Docker containers to spin up. It uses Vanilla JS for the frontend and a lightweight Express server with a local JSON file (`database.json`) for persistence.

## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (v16 or higher recommended). 
2. **Gemini API Key**: You need an API key from Google AI Studio to power the AI Career Mentor and Quiz Recommendation features.

## Step-by-Step Installation

### 1. Clone or Extract the Project
Ensure you are in the root directory of the project.

### 2. Install Dependencies
Navigate into the backend directory (where the `package.json` is located) and install the required NPM modules.
```bash
cd backend
npm install
```

### 3. Configure the Environment
Create a `.env` file inside the `backend` folder and add your Gemini API Key and a JWT Secret.
```bash
# backend/.env
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=super_secret_jwt_key_for_careersathi
```

### 4. Start the Server
Run the application!
```bash
npm start
```
You should see:
```text
Server running on port 5000
```

### 5. Access the Platform
Open your browser and navigate to:
```text
http://localhost:5000
```

## Admin Access
To test the admin panel and resource management features:
1. Go to the Registration page on the platform.
2. Register a new account using the exact email: `admin@careersathi.com`.
3. Upon logging in, you will see a yellow **Admin Panel** button in the top navigation bar.

## Troubleshooting
- **Port in use:** If port 5000 is occupied, you can change the `PORT` variable in the `.env` file.
- **Database issues:** If you ever need to "factory reset" the app, simply delete the contents of `backend/database.json` and replace it with `{ "users": [], "resources": [] }`.

Enjoy exploring CareerSathi!
