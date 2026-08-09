const express = require('express');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { readDB, writeDB } = require('../db');

const router = express.Router();

// Apply both middlewares to all routes in this router
router.use(authMiddleware, adminMiddleware);

// GET all users
router.get('/users', (req, res) => {
  try {
    const db = readDB();
    // Return safe user data (without password hash)
    const users = db.users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.json({ users });
  } catch (error) {
    console.error('Admin Fetch Users Error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST new resource
router.post('/resources', (req, res) => {
  try {
    const { title, description, type, provider, category, skills, difficulty, duration, isFree, amount, deadline, location, url, image, featured } = req.body;
    if (!title || !url || !category || !type) {
      return res.status(400).json({ error: 'Title, URL, Category, and Type are required' });
    }

    const db = readDB();
    if (!db.resources) db.resources = [];

    const newResource = {
      id: Date.now(), // Generate a simple ID
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
    writeDB(db);

    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (error) {
    console.error('Admin Add Resource Error:', error);
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

// PUT update resource
router.put('/resources/:id', (req, res) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    const updates = req.body;
    const db = readDB();
    
    if (!db.resources) db.resources = [];
    
    const index = db.resources.findIndex(r => r.id === resourceId);
    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    db.resources[index] = { ...db.resources[index], ...updates };
    writeDB(db);

    res.json({ message: 'Resource updated successfully', resource: db.resources[index] });
  } catch (error) {
    console.error('Admin Update Resource Error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// DELETE resource
router.delete('/resources/:id', (req, res) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    const db = readDB();
    
    if (!db.resources) db.resources = [];
    
    const initialLength = db.resources.length;
    db.resources = db.resources.filter(r => r.id !== resourceId);

    if (db.resources.length === initialLength) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    writeDB(db);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Resource Error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router;
