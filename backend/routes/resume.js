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

module.exports = router;
