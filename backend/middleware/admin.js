const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId); // userId is set by authMiddleware
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    res.status(500).json({ error: 'Server error in admin authorization' });
  }
};

module.exports = adminMiddleware;
