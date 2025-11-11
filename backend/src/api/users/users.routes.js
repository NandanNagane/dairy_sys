// FILE: src/api/users/users.routes.js

import express from 'express';
import * as usersController from './users.controller.js';
import { authenticateToken, requireAdmin, requireAdminOrSelfAccess } from '../../middleware/auth.middleware.js';

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

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user profile
 * @access  Admin only
 */
router.put('/:id', authenticateToken, requireAdmin, usersController.updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireAdmin, usersController.deleteUser);

export default router;
