// FILE: src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware to verify JWT token and attach user data to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optional: Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user data to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

/**
 * Middleware to check if user can access farmer-specific data
 * Allows admin to access any farmer's data, or farmers to access only their own data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdminOrSelfAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const targetUserId = req.params.userId || req.params.id;
  
  // Admin can access any user's data
  if (req.user.role === 'ADMIN') {
    return next();
  }
  
  // Farmers can only access their own data
  if (req.user.role === 'FARMER' && req.user.userId === targetUserId) {
    return next();
  }
  
  return res.status(403).json({ error: 'Access denied' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAdminOrSelfAccess
};
