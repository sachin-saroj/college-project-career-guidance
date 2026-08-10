const express = require('express');
const { z } = require('zod');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const User = require('../models/User');

const router = express.Router();

const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  education: z.string().max(500).optional(),
  skills: z.string().max(1000).optional(),
  interests: z.string().max(1000).optional(),
  careerGoal: z.string().max(500).optional(),
  familyIncome: z.string().max(100).optional()
});

// GET current user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove password hash before sending
    const { passwordHash, ...safeUser } = user;
    res.json({ profile: safeUser });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT update user profile
router.put('/', authMiddleware, validate(profileUpdateSchema), async (req, res) => {
  try {
    const { name, education, skills, interests, careerGoal, familyIncome } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await User.update(req.userId, {
      education: education !== undefined ? education : user.education,
      skills: skills !== undefined ? skills : user.skills,
      interests: interests !== undefined ? interests : user.interests,
      careerGoal: careerGoal !== undefined ? careerGoal : user.careerGoal,
      familyIncome: familyIncome !== undefined ? familyIncome : user.familyIncome,
      name: name !== undefined ? name : user.name
    });

    const { passwordHash, ...safeUser } = updatedUser;
    res.json({ message: 'Profile updated successfully', profile: safeUser });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE user account
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const success = await User.delete(req.userId);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account Deletion Error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
