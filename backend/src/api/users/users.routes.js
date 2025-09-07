// FILE: src/api/users/users.routes.js

const express = require('express');
const usersController = require('./users.controller');
const { authenticateToken, requireAdmin, requireAdminOrSelfAccess } = require('../../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (with optional role filtering)
 * @access  Admin only
 */
router.get('/', authenticateToken, requireAdmin, usersController.getAllUsers);

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user's profile
 * @access  Authenticated users
 */
router.get('/me', authenticateToken, usersController.getCurrentUser);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user profile by ID
 * @access  Admin only
 */
router.get('/:id', authenticateToken, requireAdmin, usersController.getUserById);

/**
 * @route   GET /api/v1/users/:userId/milk-collections
 * @desc    Get milk collections for a specific user
 * @access  Admin or the specific farmer
 */
router.get('/:userId/milk-collections', authenticateToken, requireAdminOrSelfAccess, usersController.getUserMilkCollections);

/**
 * @route   GET /api/v1/users/:userId/payments
 * @desc    Get payment history for a specific user
 * @access  Admin or the specific farmer
 */
router.get('/:userId/payments', authenticateToken, requireAdminOrSelfAccess, usersController.getUserPayments);

module.exports = router;
