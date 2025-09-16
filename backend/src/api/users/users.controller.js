// FILE: src/api/users/users.controller.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all users with optional role filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    // Build where clause for filtering
    const where = {};
    if (role && ['ADMIN', 'FARMER'].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            milkCollections: true,
            payments: true
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Get current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          milkCollections: true,
          payments: true
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

/**
 * Get user profile by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          milkCollections: true,
          payments: true
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

/**
 * Get milk collections for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserMilkCollections = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build where clause for filtering
    const where = { userId };
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get milk collections with pagination
    const [milkCollections, totalCount] = await Promise.all([
      prisma.milkCollection.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.milkCollection.count({ where })
    ]);

    // Calculate summary statistics
    const summary = await prisma.milkCollection.aggregate({
      where,
      _sum: {
        quantity: true
      },
      _avg: {
        fatPercentage: true,
        snf: true
      },
      _count: true
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      milkCollections,
      summary: {
        totalQuantity: summary._sum.quantity || 0,
        averageFat: summary._avg.fatPercentage || 0,
        averageSnf: summary._avg.snf || 0,
        totalRecords: summary._count
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
    console.error('Get user milk collections error:', error);
    res.status(500).json({ error: 'Failed to fetch milk collections' });
  }
};

/**
 * Get payment history for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Build where clause for filtering
    const where = { userId };
    
    if (status && ['PENDING', 'PAID'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.payment.count({ where })
    ]);

    // Calculate summary statistics
    const summary = await prisma.payment.aggregate({
      where,
      _sum: {
        amount: true
      },
      _count: true
    });

    const statusSummary = await prisma.payment.groupBy({
      by: ['status'],
      where: { userId },
      _sum: {
        amount: true
      },
      _count: true
    });

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      payments,
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalRecords: summary._count,
        statusBreakdown: statusSummary.reduce((acc, item) => {
          acc[item.status] = {
            count: item._count,
            amount: item._sum.amount || 0
          };
          return acc;
        }, {})
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
    console.error('Get user payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

export {
  getAllUsers,
  getCurrentUser,
  getUserById,
  getUserMilkCollections,
  getUserPayments
};
