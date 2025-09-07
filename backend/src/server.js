// FILE: src/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

// Import route modules
const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/users/users.routes');
const milkCollectionRoutes = require('./api/milk-collections/milk-collections.routes');
const paymentRoutes = require('./api/payments/payments.routes');
const expenseRoutes = require('./api/expenses/expenses.routes');
const reportRoutes = require('./api/reports/reports.routes');

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/milk-collections', milkCollectionRoutes);
app.use('/api/v1', paymentRoutes); // For billing and payments
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/reports', reportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  if (err.code === 'P2002' && err.meta?.target) {
    return res.status(400).json({ 
      error: 'Duplicate entry',
      message: `A record with this ${err.meta.target.join(', ')} already exists.`
    });
  }
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
