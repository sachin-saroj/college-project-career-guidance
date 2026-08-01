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
    const { title, description, url, category, tags } = req.body;
    if (!title || !url || !category) {
      return res.status(400).json({ error: 'Title, URL, and Category are required' });
    }

    const db = readDB();
    if (!db.resources) db.resources = [];

    const newResource = {
      id: Date.now(), // Generate a simple ID
      title,
      description: description || '',
      url,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    db.resources.push(newResource);
    writeDB(db);

    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (error) {
    console.error('Admin Add Resource Error:', error);
    res.status(500).json({ error: 'Failed to add resource' });
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
