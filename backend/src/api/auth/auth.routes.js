// FILE: src/api/auth/auth.routes.js

import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/initialize-admin
 * @desc    Initialize the first admin user (one-time setup)
 * @access  Public (but fails if admin already exists)
 */
router.post('/initialize-admin', authController.initializeAdmin);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new farmer
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', authController.login);

export default router;
