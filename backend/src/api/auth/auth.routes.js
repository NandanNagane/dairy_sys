// FILE: src/api/auth/auth.routes.js

const express = require('express');
const authController = require('./auth.controller');

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

module.exports = router;
