// FILE: src/api/expenses/expenses.routes.js

import express from 'express';
import * as expensesController from './expenses.controller.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/v1/expenses
 * @desc    Record a new expense
 * @access  Admin only
 */
router.post('/', authenticateToken, requireAdmin, expensesController.createExpense);

/**
 * @route   GET /api/v1/expenses
 * @desc    Get all expenses with filtering options
 * @access  Admin only
 */
router.get('/', authenticateToken, requireAdmin, expensesController.getAllExpenses);

/**
 * @route   GET /api/v1/expenses/:id
 * @desc    Get a specific expense by ID
 * @access  Admin only
 */
router.get('/:id', authenticateToken, requireAdmin, expensesController.getExpenseById);

/**
 * @route   PUT /api/v1/expenses/:id
 * @desc    Update an expense
 * @access  Admin only
 */
router.put('/:id', authenticateToken, requireAdmin, expensesController.updateExpense);

/**
 * @route   DELETE /api/v1/expenses/:id
 * @desc    Delete an expense
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireAdmin, expensesController.deleteExpense);

export default router;
