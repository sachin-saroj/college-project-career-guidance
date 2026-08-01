const express = require('express');
const authMiddleware = require('../middleware/auth');
const { readDB, writeDB } = require('../db');

const router = express.Router();

const initialResources = [
  {
    id: 1,
    title: "Khan Academy",
    description: "Free online courses, lessons, and practice for various subjects including math, science, and computing.",
    url: "https://www.khanacademy.org/",
    category: "Courses",
    tags: ["Math", "Science", "Free"]
  },
  {
    id: 2,
    title: "freeCodeCamp",
    description: "Learn to code for free. Build projects and earn certifications in web development, data science, and more.",
    url: "https://www.freecodecamp.org/",
    category: "Tech",
    tags: ["Programming", "Web Dev", "Certifications"]
  },
  {
    id: 3,
    title: "National Scholarship Portal",
    description: "Centralized portal for government scholarships across various schemes and ministries for Indian students.",
    url: "https://scholarships.gov.in/",
    category: "Scholarships",
    tags: ["Government", "Financial Aid"]
  },
  {
    id: 4,
    title: "Coursera Financial Aid",
    description: "Apply for financial aid to access premium courses on Coursera for free.",
    url: "https://www.coursera.org/",
    category: "Courses",
    tags: ["University Courses", "Financial Aid"]
  },
  {
    id: 5,
    title: "Project Gutenberg",
    description: "A library of over 60,000 free eBooks, focusing on older works for which U.S. copyright has expired.",
    url: "https://www.gutenberg.org/",
    category: "Study Materials",
    tags: ["Books", "Literature", "Free"]
  }
];

router.get('/', authMiddleware, (req, res) => {
  try {
    const db = readDB();
    if (!db.resources || db.resources.length === 0) {
      db.resources = initialResources;
      writeDB(db);
    }
    res.json({ resources: db.resources });
  } catch (error) {
    console.error('Resources Error:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

module.exports = router;
