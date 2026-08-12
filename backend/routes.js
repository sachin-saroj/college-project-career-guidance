import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth, admin } from './middleware/index.js';
import validate from './middleware/validate.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { logger } from './logger.js';
import { getUsers, saveUsers } from './db.js';


const router = express.Router();

// Multer memory storage configuration for resume file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper utilities for user operations
const findUserById = (db, id) => db.users.find(u => u._id === id || u.id === id);
const findUserByEmail = (db, email) => db.users.find(u => u.email === email);

function getProfileCompletionScore(user) {
  if (!user) return 0;
  let score = 0;
  if (user.name && user.name.trim()) score += 20;
  if (user.education && user.education.trim()) score += 16;
  if (user.skills && user.skills.trim()) score += 16;
  if ((user.interests && user.interests.trim()) || (user.careerGoal && user.careerGoal.trim())) score += 16;
  if (user.assessmentCompleted) score += 16;
  if (user.resumeData || (user.resumeText && user.resumeText.trim())) score += 16;
  return score;
}

const initialResources = [
  {
    id: 1,
    title: "Introduction to Computer Science (CS50)",
    description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
    type: "course",
    provider: "Harvard University / edX",
    category: "Courses",
    skills: ["C", "Python", "SQL", "HTML", "CSS", "JavaScript"],
    difficulty: "Beginner",
    duration: "12 weeks",
    isFree: true,
    url: "https://pll.harvard.edu/course/cs50-introduction-computer-science",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Google Data Analytics Professional Certificate",
    description: "Get professional training designed by Google and have the opportunity to connect with top employers.",
    type: "course",
    provider: "Google",
    category: "Courses",
    skills: ["Spreadsheets", "SQL", "Tableau", "R Programming"],
    difficulty: "Beginner",
    duration: "6 months",
    isFree: false,
    url: "https://grow.google/certificates/data-analytics/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "National Scholarship Portal",
    description: "Centralized portal for government scholarships across various schemes and ministries for Indian students.",
    type: "scholarship",
    provider: "Government of India",
    category: "Scholarships",
    amount: "Varies",
    deadline: "Check portal",
    isFree: true,
    url: "https://scholarships.gov.in/",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Frontend Developer Roadmap",
    description: "Step by step guide to becoming a modern frontend developer in 2024.",
    type: "roadmap",
    provider: "roadmap.sh",
    category: "Roadmaps",
    skills: ["HTML", "CSS", "JavaScript", "React", "Build Tools"],
    difficulty: "Intermediate",
    isFree: true,
    url: "https://roadmap.sh/frontend",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "Software Engineering Intern",
    description: "Join our fast-paced engineering team as an intern and build features used by millions.",
    type: "internship",
    provider: "Tech Startup Inc.",
    category: "Internships",
    skills: ["React", "Node.js", "MongoDB"],
    location: "Remote / Bangalore",
    duration: "6 months",
    deadline: "Rolling",
    isFree: true,
    url: "https://example.com/internships",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    featured: false,
    createdAt: new Date().toISOString()
  }
];

async function ensureResources(db) {
  if (!db.resources || db.resources.length === 0) {
    db.resources = initialResources;
    await saveUsers(db);
  }
}

// ----- AUTH ENDPOINTS -----
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters")
});

router.post('/auth/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const db = await getUsers();
  
  if (findUserByEmail(db, email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    role: 'user',
    passwordHash,
    resumeText: '',
    resumeData: null,
    education: '',
    skills: '',
    interests: '',
    careerGoal: '',
    familyIncome: '',
    assessmentCompleted: false,
    lastRecommendations: null,
    bookmarkedResources: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  await saveUsers(db);

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server configuration error' });

  const token = jwt.sign({ userId: newUser._id, role: newUser.role }, secret, { expiresIn: '7d' });
  const { passwordHash: _, ...safeUser } = newUser;
  logger.info(`User registered successfully: ${email}`);
  res.status(201).json({ token, user: safeUser });
}));

router.post('/auth/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const db = await getUsers();
  const user = findUserByEmail(db, email);

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server configuration error' });

  const token = jwt.sign({ userId: user._id, role: user.role || 'user' }, secret, { expiresIn: '7d' });
  const { passwordHash: _, ...safeUser } = user;
  logger.info(`User logged in successfully: ${email}`);
  res.json({ token, user: safeUser });
}));


router.get('/auth/me', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
}));

router.post('/auth/change-password', auth, validate(changePasswordSchema), asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await saveUsers(db);

  res.json({ message: 'Password changed successfully' });
}));

// ----- PROFILE ENDPOINTS -----
const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  education: z.string().max(500).optional(),
  skills: z.string().max(1000).optional(),
  interests: z.string().max(1000).optional(),
  careerGoal: z.string().max(500).optional(),
  familyIncome: z.string().max(100).optional()
});

router.get('/profile', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { passwordHash, ...safeUser } = user;
  res.json({ profile: safeUser });
}));

router.put('/profile', auth, validate(profileUpdateSchema), asyncHandler(async (req, res) => {
  const db = await getUsers();
  const index = db.users.findIndex(u => u._id === req.userId || u.id === req.userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const { name, education, skills, interests, careerGoal, familyIncome } = req.body;
  const user = db.users[index];

  if (name !== undefined) user.name = name;
  if (education !== undefined) user.education = education;
  if (skills !== undefined) user.skills = skills;
  if (interests !== undefined) user.interests = interests;
  if (careerGoal !== undefined) user.careerGoal = careerGoal;
  if (familyIncome !== undefined) user.familyIncome = familyIncome;

  await saveUsers(db);

  const { passwordHash, ...safeUser } = user;
  res.json({ message: 'Profile updated successfully', profile: safeUser });
}));

router.delete('/profile', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  const index = db.users.findIndex(u => u._id === req.userId || u.id === req.userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  db.users.splice(index, 1);
  await saveUsers(db);

  res.json({ message: 'Account deleted successfully' });
}));

// ----- CHAT ENDPOINT -----
const chatSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(4000, "Prompt exceeds maximum allowed length")
});

router.post('/chat', auth, validate(chatSchema), asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
    const mockReply = `Here is a breakdown of your query about **"${prompt}"**:\n\n### Recommended Paths\n- **Option 1**: Software Engineering\n- **Option 2**: Data Science\n\n1. First step is to build a portfolio.\n2. Apply for internships.\n\nLet me know if you want to dive deeper into any of these!`;
    return res.json({ reply: mockReply });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const db = await getUsers();
    const user = findUserById(db, req.userId);

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
  } catch (err) {
    logger.error('Gemini Chat API Error:', err);
    const fallbackReply = `Here is guidance regarding **"${prompt}"**:\n\n1. Focus on core fundamentals and hands-on projects.\n2. Build a strong GitHub repository.\n3. Network with mentors and apply for open entry-level positions.`;
    res.json({ reply: fallbackReply });
  }
}));

// ----- ASSESSMENT ENDPOINTS -----
const assessmentQuestions = [
  { id: "q1", type: "mcq", text: "When working on a project, you prefer:", options: ["Working alone", "Working in a small team", "Leading everyone", "Following clear instructions"] },
  { id: "q2", type: "likert", text: "I enjoy solving complex mathematical or logical problems.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: "q3", type: "mcq", text: "Which of the following activities appeals to you the most?", options: ["Designing a new product or application", "Analyzing data to find trends", "Writing stories or creating art", "Helping people with their personal problems"] },
  { id: "q4", type: "likert", text: "I am comfortable speaking in front of large groups of people.", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
  { id: "q5", type: "mcq", text: "When faced with a difficult decision, I usually:", options: ["Rely on facts and data", "Trust my intuition", "Ask for others' opinions", "Consider the ethical implications first"] }
];

const assessmentSubmitSchema = z.object({
  answers: z.array(z.string()).min(1, "At least one answer is required")
});

router.get('/assessment', auth, (req, res) => {
  res.json({ questions: assessmentQuestions });
});

router.post('/assessment/submit', auth, validate(assessmentSubmitSchema), asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const db = await getUsers();
  const user = findUserById(db, req.userId);

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

  let parsedData;
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
    parsedData = {
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
  } else {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
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
      try {
        parsedData = JSON.parse(reply);
      } catch (e) {
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
        else throw new Error("Invalid JSON from Gemini");
      }
    } catch (err) {
      logger.error('Gemini Assessment API Error:', err);
      parsedData = {
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
    }
  }

  if (user) {
    user.assessmentCompleted = true;
    user.lastRecommendations = parsedData;
    await saveUsers(db);
  }

  res.json(parsedData);
}));

// ----- RESOURCES ENDPOINTS -----
router.get('/resources/search', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  await ensureResources(db);

  const query = (req.query.q || '').toLowerCase();
  if (!query) return res.json({ resources: db.resources });

  const matched = db.resources.filter(r => (
    (r.title && r.title.toLowerCase().includes(query)) ||
    (r.description && r.description.toLowerCase().includes(query)) ||
    (r.provider && r.provider.toLowerCase().includes(query)) ||
    (r.category && r.category.toLowerCase().includes(query)) ||
    (r.skills && r.skills.some(s => s.toLowerCase().includes(query)))
  ));

  res.json({ resources: matched });
}));

router.get('/resources/bookmarks', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  ensureResources(db);
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const bookmarkedIds = user.bookmarkedResources || [];
  const bookmarkedResources = db.resources.filter(r => bookmarkedIds.includes(r.id));
  res.json({ resources: bookmarkedResources, bookmarkIds: bookmarkedIds });
}));

router.post('/resources/bookmarks', auth, asyncHandler(async (req, res) => {
  const { resourceId } = req.body;
  if (!resourceId) return res.status(400).json({ error: 'Resource ID is required' });

  const db = await getUsers();
  ensureResources(db);
  const resId = parseInt(resourceId, 10);
  const resourceExists = db.resources.some(r => r.id === resId);
  if (!resourceExists) return res.status(404).json({ error: 'Resource not found' });

  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.bookmarkedResources) user.bookmarkedResources = [];
  if (!user.bookmarkedResources.includes(resId)) {
    user.bookmarkedResources.push(resId);
    await saveUsers(db);
  }

  res.json({ message: 'Resource bookmarked', bookmarkIds: user.bookmarkedResources });
}));

router.delete('/resources/bookmarks/:id', auth, asyncHandler(async (req, res) => {
  const resourceId = parseInt(req.params.id, 10);
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.bookmarkedResources) user.bookmarkedResources = [];
  user.bookmarkedResources = user.bookmarkedResources.filter(id => id !== resourceId);
  await saveUsers(db);

  res.json({ message: 'Resource bookmark removed', bookmarkIds: user.bookmarkedResources });
}));

router.get('/resources/:id', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  ensureResources(db);

  const resource = db.resources.find(r => r.id === parseInt(req.params.id, 10));
  if (!resource) return res.status(404).json({ error: 'Resource not found' });

  res.json({ resource });
}));

router.get('/resources', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  await ensureResources(db);

  const user = findUserById(db, req.userId);
  const bookmarkIds = user ? (user.bookmarkedResources || []) : [];

  res.json({ resources: db.resources, bookmarkIds });
}));

// ----- ADMIN ENDPOINTS -----
// Helper middleware function to attach user object for admin check
const setAdminUser = asyncHandler(async (req, res, next) => {
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  req.currentUser = user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
});

router.get('/admin/users', auth, setAdminUser, asyncHandler(async (req, res) => {
  const db = await getUsers();
  const users = db.users.map(u => ({
    id: u._id || u.id,
    name: u.name,
    email: u.email,
    role: u.role || 'user',
    createdAt: u.createdAt
  }));
  res.json({ users });
}));

router.post('/admin/resources', auth, setAdminUser, asyncHandler(async (req, res) => {
  const { title, description, type, provider, category, skills, difficulty, duration, isFree, amount, deadline, location, url, image, featured } = req.body;
  if (!title || !url || !category || !type) {
    return res.status(400).json({ error: 'Title, URL, Category, and Type are required' });
  }

  const db = await getUsers();
  ensureResources(db);

  const newResource = {
    id: Date.now(),
    title,
    description: description || '',
    type,
    provider: provider || '',
    category,
    skills: skills || [],
    difficulty: difficulty || '',
    duration: duration || '',
    isFree: isFree !== undefined ? isFree : true,
    amount: amount || '',
    deadline: deadline || '',
    location: location || '',
    url,
    image: image || '',
    featured: featured || false,
    createdAt: new Date().toISOString()
  };

  db.resources.push(newResource);
  await saveUsers(db);

  res.status(201).json({ message: 'Resource added successfully', resource: newResource });
}));

router.put('/admin/resources/:id', auth, setAdminUser, asyncHandler(async (req, res) => {
  const resourceId = parseInt(req.params.id, 10);
  const updates = req.body;
  const db = await getUsers();
  ensureResources(db);

  const index = db.resources.findIndex(r => r.id === resourceId);
  if (index === -1) return res.status(404).json({ error: 'Resource not found' });

  db.resources[index] = { ...db.resources[index], ...updates };
  await saveUsers(db);

  res.json({ message: 'Resource updated successfully', resource: db.resources[index] });
}));

router.delete('/admin/resources/:id', auth, setAdminUser, asyncHandler(async (req, res) => {
  const resourceId = parseInt(req.params.id, 10);
  const db = await getUsers();
  ensureResources(db);

  const initialLength = db.resources.length;
  db.resources = db.resources.filter(r => r.id !== resourceId);

  if (db.resources.length === initialLength) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  await saveUsers(db);
  res.json({ message: 'Resource deleted successfully' });
}));

router.get('/admin/export', auth, setAdminUser, asyncHandler(async (req, res) => {
  const db = await getUsers();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=careersathi_database_${Date.now()}.json`);
  res.send(JSON.stringify(db, null, 2));
}));

router.post('/admin/import', auth, setAdminUser, asyncHandler(async (req, res) => {
  const newDbData = req.body;
  if (!newDbData || typeof newDbData !== 'object' || !Array.isArray(newDbData.users) || !Array.isArray(newDbData.resources)) {
    return res.status(400).json({ error: 'Payload must contain users and resources arrays' });
  }

  await saveUsers(newDbData);
  res.json({ message: 'Database imported and restored successfully' });
}));

router.put('/admin/users/:id/role', auth, setAdminUser, asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  const db = await getUsers();
  const userObj = findUserById(db, userId);
  if (!userObj) return res.status(404).json({ error: 'User not found' });

  userObj.role = role;
  await saveUsers(db);

  res.json({ message: 'User role updated successfully', user: { id: userObj._id || userObj.id, name: userObj.name, role: userObj.role } });
}));

router.delete('/admin/users/:id', auth, setAdminUser, asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const db = await getUsers();
  const initialLength = db.users.length;
  db.users = db.users.filter(u => u._id !== userId && u.id !== userId);

  if (db.users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }

  await saveUsers(db);
  res.json({ message: 'User deleted successfully' });
}));

// ----- DASHBOARD ENDPOINTS -----
router.get('/dashboard/stats', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const profileCompletion = getProfileCompletionScore(user);
  res.json({
    profileCompletion,
    savedResourcesCount: user.bookmarkedResources?.length || 0,
    assessmentCompleted: user.assessmentCompleted || false,
    lastRecommendations: user.lastRecommendations || null
  });
}));

router.get('/dashboard', auth, asyncHandler(async (req, res) => {
  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const tasks = [];
  if (!user.assessmentCompleted) {
    tasks.push({ id: "t1", name: "Complete Career Assessment", description: "Discover your optimal career path", deadline: "ASAP", priority: "High", status: "Pending", route: "/assessment" });
  } else {
    tasks.push({ id: "t1", name: "Career Assessment", description: "Assessment completed", deadline: "-", priority: "Low", status: "Completed", route: "/assessment" });
  }

  if (!user.resumeData) {
    tasks.push({ id: "t2", name: "Build Your Resume", description: "Create your professional resume", deadline: "Next 7 days", priority: "Medium", status: "Pending", route: "/resume" });
  } else {
    tasks.push({ id: "t2", name: "Update Resume", description: "Resume created", deadline: "-", priority: "Low", status: "Completed", route: "/resume" });
  }

  if (user.bookmarkedResources && user.bookmarkedResources.length === 0) {
    tasks.push({ id: "t3", name: "Explore Resources", description: "Save scholarships or internships", deadline: "Optional", priority: "Low", status: "Pending", route: "/resources" });
  }

  const profileCompletion = getProfileCompletionScore(user);
  res.json({
    profileCompletion,
    tasks,
    savedResourcesCount: user.bookmarkedResources?.length || 0,
    recommendations: user.lastRecommendations || null,
  });
}));

// ----- RESUME ENDPOINTS -----
router.post('/resume/upload', auth, upload.single('resume'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (req.file.mimetype !== 'application/pdf') return res.status(400).json({ error: 'Only PDF files are allowed' });

  const pdfData = await pdfParse(req.file.buffer);
  const resumeText = pdfData.text;

  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.resumeText = resumeText;
  await saveUsers(db);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
    return res.json({ message: 'Resume uploaded successfully', suggestions: "Resume uploaded successfully. Add skills and project details to strengthen your profile." });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Act as an expert career counselor and resume reviewer. Analyze this extracted resume text and provide 3-5 constructive suggestions for improvement and 3 potential career paths suited for this profile.\n\nResume Text:\n${resumeText.substring(0, 10000)}`;
  const result = await model.generateContent(prompt);
  const suggestions = result.response.text();

  res.json({ message: 'Resume uploaded successfully', suggestions });
}));

router.put('/resume', auth, asyncHandler(async (req, res) => {
  const resumeData = req.body;
  if (!resumeData) return res.status(400).json({ error: 'Resume data is required' });

  const db = await getUsers();
  const user = findUserById(db, req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.resumeData = resumeData;
  await saveUsers(db);

  res.json({ message: 'Resume saved successfully' });
}));

router.post('/resume/analyze', auth, asyncHandler(async (req, res) => {
  const resumeData = req.body;
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
    return res.json({
      score: 85,
      missingSkills: ["Docker", "TypeScript"],
      formattingIssues: ["Add quantifiable achievements"],
      suggestions: ["Highlight impact metrics", "Add link to GitHub portfolio"]
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are an ATS expert. Analyze this resume JSON and return a strict JSON object with fields: score (number 0-100), missingSkills (array), formattingIssues (array), suggestions (array).\n\nResume JSON:\n${JSON.stringify(resumeData)}`;
  const result = await model.generateContent(prompt);
  let reply = result.response.text();
  const jsonMatch = reply.match(/\{[\s\S]*\}/);
  const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : reply);

  res.json(parsedData);
}));

router.post('/resume/rewrite', auth, asyncHandler(async (req, res) => {
  const { sectionType, content } = req.body;
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
    return res.json({ result: `Enhanced ${sectionType}: ${content}` });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Rewrite the following ${sectionType} content to make it more professional and impact-driven. Return ONLY the rewritten text:\n\n${content}`;
  const result = await model.generateContent(prompt);

  res.json({ result: result.response.text().trim() });
}));

export default router;
