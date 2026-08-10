const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
      const mockReply = `Here is a breakdown of your query about **"${prompt}"**:\n\n### Recommended Paths\n- **Option 1**: Software Engineering\n- **Option 2**: Data Science\n\n1. First step is to build a portfolio.\n2. Apply for internships.\n\nLet me know if you want to dive deeper into any of these!`;
      return res.json({ reply: mockReply });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const user = await User.findById(req.userId);
    
    let systemContext = "You are CareerSathi, a helpful career guidance AI mentor for underprivileged students. Provide practical, empathetic, and actionable advice.";
    if (user) {
      systemContext += `\n\nStudent Profile Context:
      - Name: ${user.name || 'Student'}
      - Education: ${user.education || 'Not provided'}
      - Skills: ${user.skills || 'Not provided'}
      - Interests: ${user.interests || 'Not provided'}
      - Career Goal: ${user.careerGoal || 'Not provided'}`;
      if (user.lastRecommendations) {
        systemContext += `\n- Top Career Match: ${user.lastRecommendations.topMatch} (${user.lastRecommendations.matchScore}% compatibility score)`;
      }
      if (user.resumeText) {
        systemContext += `\n- Resume Context: ${user.resumeText.substring(0, 1000)}`;
      }
    }

    const fullPrompt = `${systemContext}\n\nUser Question: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

module.exports = router;
