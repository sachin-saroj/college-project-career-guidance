const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Use memory storage for multer (don't save to disk to keep it simple)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Parse PDF text
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // Save to user profile
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await User.update(req.userId, { resumeText });

    // Call Gemini for suggestions
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as an expert career counselor and resume reviewer. I am providing the text extracted from a resume. 
    Please analyze it and provide 3-5 constructive suggestions for improvement and 3 potential career paths suited for this profile.
    Keep the response concise and formatted nicely.
    
    Resume Text:
    ${resumeText.substring(0, 10000)} // Truncate to avoid token limits if it's too long
    `;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

    res.json({ message: 'Resume uploaded successfully', suggestions });
  } catch (error) {
    console.error('Resume Upload Error:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const resumeData = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.update(req.userId, { resumeData });
    res.json({ message: 'Resume saved successfully' });
  } catch (error) {
    console.error('Resume Save Error:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const resumeData = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume JSON and return a strict JSON object with these fields:
    - score (number between 0 and 100)
    - missingSkills (array of strings)
    - formattingIssues (array of strings)
    - suggestions (array of strings)
    
    Resume JSON:
    ${JSON.stringify(resumeData)}
    `;

    const result = await model.generateContent(prompt);
    let reply = result.response.text();
    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : reply);

    res.json(parsedData);
  } catch (error) {
    console.error('Resume Analyze Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

router.post('/rewrite', authMiddleware, async (req, res) => {
  try {
    const { sectionType, content } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert resume writer. Rewrite the following ${sectionType} content to make it more professional, ATS-friendly, and impactful. Return ONLY the rewritten text without any quotes or explanations.

    Original content:
    ${content}
    `;

    const result = await model.generateContent(prompt);
    res.json({ result: result.response.text().trim() });
  } catch (error) {
    console.error('Resume Rewrite Error:', error);
    res.status(500).json({ error: 'Failed to rewrite section' });
  }
});

module.exports = router;
