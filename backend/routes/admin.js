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

// GET export full database JSON
router.get('/export', (req, res) => {
  try {
    const db = readDB();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=careersathi_database_${Date.now()}.json`);
    res.send(JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Admin Export Error:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
});

// POST import full database JSON
router.post('/import', (req, res) => {
  try {
    const newDbData = req.body;
    if (!newDbData || typeof newDbData !== 'object') {
      return res.status(400).json({ error: 'Invalid database payload' });
    }
    if (!Array.isArray(newDbData.users) || !Array.isArray(newDbData.resources)) {
      return res.status(400).json({ error: 'Payload must contain users and resources arrays' });
    }

    writeDB(newDbData);
    res.json({ message: 'Database imported and restored successfully' });
  } catch (error) {
    console.error('Admin Import Error:', error);
    res.status(500).json({ error: 'Failed to import database' });
  }
});

// PUT update user role
router.put('/users/:id/role', (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const db = readDB();
    const userObj = db.users.find(u => u._id === userId || u.id === userId);
    if (!userObj) {
      return res.status(404).json({ error: 'User not found' });
    }

    userObj.role = role;
    writeDB(db);

    res.json({ message: 'User role updated successfully', user: { id: userObj._id, name: userObj.name, role: userObj.role } });
  } catch (error) {
    console.error('Admin Role Update Error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// DELETE user
router.delete('/users/:id', (req, res) => {
  try {
    const userId = req.params.id;
    const db = readDB();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u._id !== userId && u.id !== userId);

    if (db.users.length === initialLength) {
      return res.status(404).json({ error: 'User not found' });
    }

    writeDB(db);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin Delete User Error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
