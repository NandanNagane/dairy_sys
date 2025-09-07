// FILE: src/api/milk-collections/milk-collections.routes.js

const express = require('express');
const milkCollectionsController = require('./milk-collections.controller');
const { authenticateToken, requireAdmin } = require('../../middleware/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/v1/milk-collections
 * @desc    Record a new milk collection
 * @access  Admin only
 */
router.post('/', authenticateToken, requireAdmin, milkCollectionsController.createMilkCollection);

/**
 * @route   GET /api/v1/milk-collections
 * @desc    Get all milk collections with filtering options
 * @access  Admin only
 */
router.get('/', authenticateToken, requireAdmin, milkCollectionsController.getAllMilkCollections);

/**
 * @route   GET /api/v1/milk-collections/:id
 * @desc    Get a specific milk collection by ID
 * @access  Admin only
 */
router.get('/:id', authenticateToken, requireAdmin, milkCollectionsController.getMilkCollectionById);

/**
 * @route   PUT /api/v1/milk-collections/:id
 * @desc    Update a milk collection
 * @access  Admin only
 */
router.put('/:id', authenticateToken, requireAdmin, milkCollectionsController.updateMilkCollection);

/**
 * @route   DELETE /api/v1/milk-collections/:id
 * @desc    Delete a milk collection
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireAdmin, milkCollectionsController.deleteMilkCollection);

module.exports = router;
