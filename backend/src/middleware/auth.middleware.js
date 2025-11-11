// FILE: src/middleware/auth.middleware.js

import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

/**
 * Middleware to verify JWT token and attach user data to request
 * Checks for token in cookies first, then falls back to Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔍 Auth Middleware - Cookies:', req.cookies);
    console.log('🔍 Auth Middleware - Headers:', req.headers.authorization);
    
    // Check for token in cookie first
    let token = req.cookies?.token;
    
    // If no cookie token, check Authorization header
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    console.log('🔍 Auth Middleware - Token found:', !!token);

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Auth Middleware - Token decoded:', decoded);

    // Attach user data to request directly from token
    // (No database query to avoid Prisma connection issues)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
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

export {
  authenticateToken,
  requireAdmin,
  requireAdminOrSelfAccess
};
