const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const { readDB, writeDB } = require('../db');

const router = express.Router();

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

const ensureResources = (db) => {
  if (!db.resources || db.resources.length === 0) {
    db.resources = initialResources;
    writeDB(db);
  }
};

// GET /api/resources/search?q=...
router.get('/search', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    ensureResources(db);
    
    const query = (req.query.q || '').toLowerCase();
    
    if (!query) {
      return res.json({ resources: db.resources });
    }
    
    const matched = db.resources.filter(r => {
      return (
        (r.title && r.title.toLowerCase().includes(query)) ||
        (r.description && r.description.toLowerCase().includes(query)) ||
        (r.provider && r.provider.toLowerCase().includes(query)) ||
        (r.category && r.category.toLowerCase().includes(query)) ||
        (r.skills && r.skills.some(s => s.toLowerCase().includes(query)))
      );
    });
    
    res.json({ resources: matched });
  } catch (error) {
    console.error('Resources Search Error:', error);
    res.status(500).json({ error: 'Failed to search resources' });
  }
});

// GET /api/resources/bookmarks
router.get('/bookmarks', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const db = readDB();
    ensureResources(db);
    
    const bookmarkedIds = user.bookmarkedResources || [];
    const bookmarkedResources = db.resources.filter(r => bookmarkedIds.includes(r.id));
    
    res.json({ resources: bookmarkedResources, bookmarkIds: bookmarkedIds });
  } catch (error) {
    console.error('Get Bookmarks Error:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// POST /api/resources/bookmarks
router.post('/bookmarks', authMiddleware, async (req, res) => {
  try {
    const { resourceId } = req.body;
    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }
    
    const db = readDB();
    const resourceExists = db.resources.some(r => r.id === parseInt(resourceId, 10));
    
    if (!resourceExists) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    const updatedBookmarks = await User.addBookmark(req.userId, parseInt(resourceId, 10));
    res.json({ message: 'Resource bookmarked', bookmarkIds: updatedBookmarks });
  } catch (error) {
    console.error('Add Bookmark Error:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// DELETE /api/resources/bookmarks/:id
router.delete('/bookmarks/:id', authMiddleware, async (req, res) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    const updatedBookmarks = await User.removeBookmark(req.userId, resourceId);
    res.json({ message: 'Resource bookmark removed', bookmarkIds: updatedBookmarks });
  } catch (error) {
    console.error('Remove Bookmark Error:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

// GET /api/resources/:id
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    ensureResources(db);
    
    const resource = db.resources.find(r => r.id === parseInt(req.params.id, 10));
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json({ resource });
  } catch (error) {
    console.error('Get Resource Error:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// GET /api/resources (All resources)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = readDB();
    ensureResources(db);
    
    const user = await User.findById(req.userId);
    const bookmarkIds = user ? (user.bookmarkedResources || []) : [];
    
    res.json({ resources: db.resources, bookmarkIds });
  } catch (error) {
    console.error('Resources Error:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

module.exports = router;
