// FILE: src/api/reports/reports.routes.js

const express = require('express');
const reportsController = require('./reports.controller');
const { authenticateToken, requireAdminOrSelfAccess } = require('../../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/v1/reports/farmer-statement/:userId
 * @desc    Generate PDF statement for a farmer
 * @access  Admin or the specific farmer
 */
router.get('/farmer-statement/:userId', authenticateToken, requireAdminOrSelfAccess, reportsController.generateFarmerStatement);

module.exports = router;
