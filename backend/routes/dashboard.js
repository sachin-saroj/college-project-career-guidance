const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate dynamic tasks based on profile completion
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

    // Determine completion percentage
    let completedSteps = 1; // registration
    let totalSteps = 4;
    
    if (user.assessmentCompleted) completedSteps++;
    if (user.resumeData) completedSteps++;
    if (user.skills && user.interests) completedSteps++; // basic profile

    const profileCompletion = Math.round((completedSteps / totalSteps) * 100);

    res.json({
      profileCompletion,
      tasks,
      savedResourcesCount: user.bookmarkedResources?.length || 0,
      recommendations: user.lastRecommendations || null,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
