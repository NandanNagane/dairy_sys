// FILE: src/server.js

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import prisma from './config/prisma.js';

// Import route modules
import authRoutes from './api/auth/auth.routes.js';
import userRoutes from './api/users/users.routes.js';
import milkCollectionRoutes from './api/milk-collections/milk-collections.routes.js';
import paymentRoutes from './api/payments/payments.routes.js';
import expenseRoutes from './api/expenses/expenses.routes.js';
import reportRoutes from './api/reports/reports.routes.js';

// Create Express app
const app = express();

// Security middleware
// app.use(helmet());

// CORS configuration for frontend
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite default port
    'http://localhost:5174', // Alternative Vite port
    'http://localhost:3000', // Common React port
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
};

app.use(cors(corsOptions));


// Rate limiting -
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs 
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

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

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, gracefully shutting down...');
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

export default app;
