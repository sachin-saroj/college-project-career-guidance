import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('FATAL: JWT_SECRET environment variable is not defined.');
      return res.status(500).json({ error: 'Server authentication configuration error' });
    }
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const admin = async (req, res, next) => {
  try {
    // req.user contains decoded payload or caller attaches req.currentUser
    if (req.user?.role !== 'admin' && req.currentUser?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    res.status(500).json({ error: 'Server error in admin authorization' });
  }
};

export { asyncHandler } from './asyncHandler.js';

