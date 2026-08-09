const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const questions = [
  {
    id: "q1",
    type: "mcq",
    text: "When working on a project, you prefer:",
    options: ["Working alone", "Working in a small team", "Leading everyone", "Following clear instructions"]
  },
  {
    id: "q2",
    type: "likert",
    text: "I enjoy solving complex mathematical or logical problems.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: "q3",
    type: "mcq",
    text: "Which of the following activities appeals to you the most?",
    options: ["Designing a new product or application", "Analyzing data to find trends", "Writing stories or creating art", "Helping people with their personal problems"]
  },
  {
    id: "q4",
    type: "likert",
    text: "I am comfortable speaking in front of large groups of people.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: "q5",
    type: "mcq",
    text: "When faced with a difficult decision, I usually:",
    options: ["Rely on facts and data", "Trust my intuition", "Ask for others' opinions", "Consider the ethical implications first"]
  }
];

router.get('/', authMiddleware, (req, res) => {
  res.json({ questions });
});

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

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
      const parsedData = {
        topMatch: "Software Engineer",
        matchScore: 92,
        skills: ["JavaScript", "Problem Solving", "React"],
        salaryRange: "₹4L - ₹10L",
        roadmap: ["Learn programming basics", "Build projects", "Apply for internships"],
        radarData: [
          { subject: "Logic", A: 90 },
          { subject: "Creativity", A: 70 },
          { subject: "Communication", A: 85 },
          { subject: "Math", A: 80 },
          { subject: "Teamwork", A: 95 }
        ]
      };
      
      if (user) {
        await User.update(user._id, {
          assessmentCompleted: true,
          lastRecommendations: parsedData
        });
      }
      return res.json(parsedData);
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
  "topMatch": "Software Engineer",
  "matchScore": 92,
  "skills": ["JavaScript", "Problem Solving", "React"],
  "salaryRange": "₹4L - ₹10L",
  "roadmap": ["Learn programming basics", "Build projects", "Apply for internships"],
  "radarData": [
    { "subject": "Logic", "A": 90 },
    { "subject": "Creativity", "A": 70 },
    { "subject": "Communication", "A": 85 },
    { "subject": "Math", "A": 80 },
    { "subject": "Teamwork", "A": 95 }
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
        lastRecommendations: parsedData
      });
    }

    res.json(parsedData);
  } catch (error) {
    console.error('Assessment Error:', error);
    res.status(500).json({ error: 'Failed to generate assessment results' });
  }
});

module.exports = router;
