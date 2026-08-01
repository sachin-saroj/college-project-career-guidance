const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    const user = await User.findById(req.userId);
    let profileContext = '';
    if (user) {
      profileContext = `
      Student Profile Context:
      - Education: ${user.education || 'Not provided'}
      - Skills: ${user.skills || 'Not provided'}
      - Interests: ${user.interests || 'Not provided'}
      - Career Goal: ${user.careerGoal || 'Not provided'}
      - Family Income: ${user.familyIncome || 'Not provided'}
      `;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-pro for better JSON generation if possible, but 1.5-flash is fine and faster.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are an expert Career Counselor AI for underprivileged students. 
Based on the following quiz answers and student profile, recommend 3 highly suitable career paths.

${profileContext}

Quiz Answers:
${answers.map((ans, idx) => `Q${idx + 1}: ${ans}`).join('\n')}

You must return ONLY a JSON object with this exact structure:
{
  "recommendations": [
    {
      "title": "Software Engineer",
      "matchPercentage": 92,
      "description": "Short explanation of the career and why it fits.",
      "skills": ["JavaScript", "Problem Solving", "React"],
      "roadmap": "1. Learn basics... 2. Build projects... 3. Apply for internships"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(reply);
    } catch (e) {
      // fallback in case response isn't purely JSON
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid JSON from Gemini");
      }
    }

    // Save results to user profile
    if (user) {
      await User.update(user._id, {
        assessmentCompleted: true,
        lastRecommendations: parsedData.recommendations
      });
    }

    res.json(parsedData);
  } catch (error) {
    console.error('Assessment Error:', error);
    res.status(500).json({ error: 'Failed to generate assessment results' });
  }
});

module.exports = router;
