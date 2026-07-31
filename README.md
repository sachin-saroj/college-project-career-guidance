# CareerSathi - Simplified Version

This is a clean, minimal, and fully functional version of the CareerSathi portal built for easy deployment and rapid learning. It uses a plain JavaScript frontend (HTML/CSS/JS) and a minimal Node.js + Express backend with MongoDB.

## Setup Instructions

1. **Environment Setup:** 
   In the `backend` folder, copy `.env.example` to `.env` (or just create a `.env` file) and fill in your connection strings:
   - `JWT_SECRET`: A secret string for signing JWT tokens.
   - `GEMINI_API_KEY`: Your Google Gemini API key for the AI mentor feature.

2. **Run the Application:**
   Navigate into the `backend` directory and install the dependencies by running `npm install`. Once installed, start the server with `npm start` (or `node server.js`). 
   The server will start on port `5000` (or whatever you set in `.env`), and it automatically serves the frontend at `http://localhost:5000/`. Simply open that URL in your browser to start using the app.
