// FILE: src/api/reports/reports.routes.js

import express from 'express';
import * as reportsController from './reports.controller.js';
import { authenticateToken, requireAdminOrSelfAccess, requireAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/reports/dashboard-stats
 * @desc    Get dashboard statistics for admin
 * @access  Admin only
 */
router.get('/dashboard-stats', authenticateToken, requireAdmin, reportsController.getDashboardStats);

/**
 * @route   GET /api/v1/reports/farmer-statement/:userId
 * @desc    Generate PDF statement for a farmer
 * @access  Admin or the specific farmer
 */
router.get('/farmer-statement/:userId', authenticateToken, requireAdminOrSelfAccess, reportsController.generateFarmerStatement);

export default router;
