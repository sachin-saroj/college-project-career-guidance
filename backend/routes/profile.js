const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

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
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { education, skills, interests, careerGoal, familyIncome } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await User.update(req.userId, {
      education: education !== undefined ? education : user.education,
      skills: skills !== undefined ? skills : user.skills,
      interests: interests !== undefined ? interests : user.interests,
      careerGoal: careerGoal !== undefined ? careerGoal : user.careerGoal,
      familyIncome: familyIncome !== undefined ? familyIncome : user.familyIncome
    });

    const { passwordHash, ...safeUser } = updatedUser;
    res.json({ message: 'Profile updated successfully', profile: safeUser });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
