// FILE: src/api/expenses/expenses.controller.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Create a new expense record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    // Validate required fields
    if (!description || !amount) {
      return res.status(400).json({ 
        error: 'Description and amount are required' 
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'Amount must be a positive number' 
      });
    }

    // Validate date if provided
    let expenseDate = new Date();
    if (date) {
      expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({ 
          error: 'Invalid date format' 
        });
      }
    }

    // Create expense record
    const expense = await prisma.expense.create({
      data: {
        description: description.trim(),
        amount,
        category: category ? category.trim() : null,
        date: expenseDate
      }
    });

    res.status(201).json({
      message: 'Expense recorded successfully',
      expense
    });

  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to record expense' });
  }
};

/**
 * Get all expenses with filtering options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllExpenses = async (req, res) => {
  try {
    const { 
      category, 
      startDate, 
      endDate,
      page = 1, 
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause for filtering
    const where = {};
    
    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive'
      };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Validate sort parameters
    const validSortFields = ['date', 'amount', 'description', 'category'];
    const orderBy = {};
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.date = 'desc';
    }

    // Get expenses with pagination
    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy,
        skip,
        take
      }),
      prisma.expense.count({ where })
    ]);

    // Calculate summary statistics
    const summary = await prisma.expense.aggregate({
      where,
      _sum: {
        amount: true
      },
      _count: true
    });

    // Get category breakdown
    const categoryBreakdown = await prisma.expense.groupBy({
      by: ['category'],
      where,
      _sum: {
        amount: true
      },
      _count: true,
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      }
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      expenses,
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalRecords: summary._count,
        categoryBreakdown: categoryBreakdown.map(item => ({
          category: item.category || 'Uncategorized',
          count: item._count,
          amount: item._sum.amount || 0
        }))
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get all expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

/**
 * Get a specific expense by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense });

  } catch (error) {
    console.error('Get expense by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
};

/**
 * Update an expense
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Validate data if provided
    const updateData = {};

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ 
          error: 'Description cannot be empty' 
        });
      }
      updateData.description = description.trim();
    }

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ 
          error: 'Amount must be a positive number' 
        });
      }
      updateData.amount = amount;
    }

    if (category !== undefined) {
      updateData.category = category ? category.trim() : null;
    }

    if (date !== undefined) {
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({ 
          error: 'Invalid date format' 
        });
      }
      updateData.date = expenseDate;
    }

    // Update expense
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

/**
 * Delete an expense
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Delete expense
    await prisma.expense.delete({
      where: { id }
    });

    res.json({ message: 'Expense deleted successfully' });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
