// FILE: src/api/payments/payments.routes.js

const express = require('express');
const paymentsController = require('./payments.controller');
const { authenticateToken, requireAdmin, requireAdminOrSelfAccess } = require('../../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/v1/billing/generate
 * @desc    Generate payment records from unbilled milk collections
 * @access  Admin only
 */
router.post('/billing/generate', authenticateToken, requireAdmin, paymentsController.generateBilling);

/**
 * @route   GET /api/v1/payments
 * @desc    Get all payment records
 * @access  Admin only
 */
router.get('/payments', authenticateToken, requireAdmin, paymentsController.getAllPayments);

/**
 * @route   GET /api/v1/payments/:id
 * @desc    Get a specific payment by ID
 * @access  Admin only
 */
router.get('/payments/:id', authenticateToken, requireAdmin, paymentsController.getPaymentById);

/**
 * @route   PATCH /api/v1/payments/:id
 * @desc    Update payment status
 * @access  Admin only
 */
router.patch('/payments/:id', authenticateToken, requireAdmin, paymentsController.updatePaymentStatus);

module.exports = router;
