// FILE: src/api/payments/payments.controller.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Milk rate per liter (can be made configurable)
const MILK_RATE_PER_LITER = 35;

/**
 * Generate payment records from unbilled milk collections
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateBilling = async (req, res) => {
  try {
    const { periodStartDate, periodEndDate, ratePerLiter = MILK_RATE_PER_LITER } = req.body;

    // Validate inputs
    if (!periodStartDate || !periodEndDate) {
      return res.status(400).json({ 
        error: 'periodStartDate and periodEndDate are required' 
      });
    }

    const startDate = new Date(periodStartDate);
    const endDate = new Date(periodEndDate);

    if (startDate >= endDate) {
      return res.status(400).json({ 
        error: 'periodStartDate must be before periodEndDate' 
      });
    }

    if (typeof ratePerLiter !== 'number' || ratePerLiter <= 0) {
      return res.status(400).json({ 
        error: 'ratePerLiter must be a positive number' 
      });
    }

    // Find all unbilled milk collections within the period
    const unbilledCollections = await prisma.milkCollection.findMany({
      where: {
        isBilled: false,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (unbilledCollections.length === 0) {
      return res.status(200).json({ 
        message: 'No unbilled milk collections found for the specified period',
        paymentsGenerated: []
      });
    }

    // Group collections by user
    const collectionsByUser = unbilledCollections.reduce((acc, collection) => {
      const userId = collection.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: collection.user,
          collections: [],
          totalQuantity: 0
        };
      }
      acc[userId].collections.push(collection);
      acc[userId].totalQuantity += collection.quantity;
      return acc;
    }, {});

    const generatedPayments = [];
    const collectionIdsToUpdate = [];

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Create payment records for each user
      for (const [userId, userData] of Object.entries(collectionsByUser)) {
        const amount = userData.totalQuantity * ratePerLiter;
        
        const payment = await tx.payment.create({
          data: {
            userId,
            amount,
            periodStartDate: startDate,
            periodEndDate: endDate,
            status: 'PENDING'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        });

        generatedPayments.push({
          ...payment,
          totalQuantity: userData.totalQuantity,
          ratePerLiter,
          collectionsCount: userData.collections.length
        });

        // Collect collection IDs to mark as billed
        userData.collections.forEach(collection => {
          collectionIdsToUpdate.push(collection.id);
        });
      }

      // Mark all collections as billed
      await tx.milkCollection.updateMany({
        where: {
          id: {
            in: collectionIdsToUpdate
          }
        },
        data: {
          isBilled: true
        }
      });
    });

    res.status(201).json({
      message: `Successfully generated ${generatedPayments.length} payment records`,
      paymentsGenerated: generatedPayments,
      summary: {
        totalFarmers: generatedPayments.length,
        totalCollections: collectionIdsToUpdate.length,
        totalAmount: generatedPayments.reduce((sum, payment) => sum + payment.amount, 0),
        periodStartDate,
        periodEndDate,
        ratePerLiter
      }
    });

  } catch (error) {
    console.error('Generate billing error:', error);
    res.status(500).json({ error: 'Failed to generate billing' });
  }
};

/**
 * Get all payment records with filtering options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPayments = async (req, res) => {
  try {
    const { 
      userId, 
      status, 
      startDate, 
      endDate,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build where clause for filtering
    const where = {};
    
    if (userId) {
      where.userId = userId;
    }

    if (status && ['PENDING', 'PAID'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

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

    // Validate sort parameters
    const validSortFields = ['createdAt', 'amount', 'periodStartDate', 'periodEndDate'];
    const orderBy = {};
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy,
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
      where,
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
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

/**
 * Get a specific payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });

  } catch (error) {
    console.error('Get payment by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

/**
 * Update payment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['PENDING', 'PAID'].includes(status.toUpperCase())) {
      return res.status(400).json({ 
        error: 'Status must be either PENDING or PAID' 
      });
    }

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!existingPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Payment status updated successfully',
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

export {
  generateBilling,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus
};
