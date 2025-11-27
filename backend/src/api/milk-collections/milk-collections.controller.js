// FILE: src/api/milk-collections/milk-collections.controller.js

import prisma from '../../config/prisma.js';

/**
 * Create a new milk collection record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createMilkCollection = async (req, res) => {
  try {
    // Debug logging
    console.log('📦 Received request body:', req.body);
    
    // Accept both frontend field names (farmerId, fat) and backend field names (userId, fatPercentage)
    const { 
      userId: userIdParam, 
      farmerId,
      quantity, 
      fatPercentage: fatPercentageParam, 
      fat,
      snf 
    } = req.body;

    // Use farmerId if provided, otherwise use userId
    const userId = farmerId || userIdParam;
    // Use fat if provided, otherwise use fatPercentage
    const fatPercentage = fat !== undefined ? fat : fatPercentageParam;

    console.log('🔍 Parsed values:', { userId, quantity, fatPercentage, snf });

    // Validate required fields
    if (!userId || !quantity || fatPercentage === undefined) {
      console.log('❌ Validation failed:', { userId, quantity, fatPercentage });
      return res.status(400).json({ 
        error: 'userId (or farmerId), quantity, and fatPercentage (or fat) are required' 
      });
    }

    // Validate data types and ranges
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ 
        error: 'Quantity must be a positive number' 
      });
    }

    if (typeof fatPercentage !== 'number' || fatPercentage < 0 || fatPercentage > 10) {
      return res.status(400).json({ 
        error: 'Fat percentage must be a number between 0 and 10' 
      });
    }

    if (snf !== undefined && (typeof snf !== 'number' || snf < 0 || snf > 15)) {
      return res.status(400).json({ 
        error: 'SNF must be a number between 0 and 15' 
      });
    }

    // Validate userId is a string (CUID format expected)
    if (typeof userId !== 'string' || userId.trim() === '') {
      return res.status(400).json({ 
        error: 'userId must be a valid string ID' 
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create milk collection record
    const milkCollection = await prisma.milkCollection.create({
      data: {
        userId,
        quantity,
        fatPercentage,
        snf: snf || 8.5 // Default SNF value
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

    res.status(201).json({
      message: 'Milk collection recorded successfully',
      milkCollection
    });

  } catch (error) {
    console.error('Create milk collection error:', error);
    res.status(500).json({ error: 'Failed to record milk collection' });
  }
};

/**
 * Get all milk collections with filtering options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllMilkCollections = async (req, res) => {
  try {
    const { 
      userId, 
      startDate, 
      endDate, 
      isBilled,
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

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (isBilled !== undefined) {
      where.isBilled = isBilled === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Validate sort parameters
    const validSortFields = ['createdAt', 'quantity', 'fatPercentage', 'snf'];
    const orderBy = {};
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Get milk collections with pagination
    const [milkCollections, totalCount] = await Promise.all([
      prisma.milkCollection.findMany({
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
    console.error('Get all milk collections error:', error);
    res.status(500).json({ error: 'Failed to fetch milk collections' });
  }
};

/**
 * Get a specific milk collection by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMilkCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const milkCollection = await prisma.milkCollection.findUnique({
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

    if (!milkCollection) {
      return res.status(404).json({ error: 'Milk collection not found' });
    }

    res.json({ milkCollection });

  } catch (error) {
    console.error('Get milk collection by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch milk collection' });
  }
};

/**
 * Update a milk collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateMilkCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, fatPercentage, snf, isBilled } = req.body;

    // Check if milk collection exists
    const existingCollection = await prisma.milkCollection.findUnique({
      where: { id }
    });

    if (!existingCollection) {
      return res.status(404).json({ error: 'Milk collection not found' });
    }

    // Validate data if provided
    const updateData = {};

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ 
          error: 'Quantity must be a positive number' 
        });
      }
      updateData.quantity = quantity;
    }

    if (fatPercentage !== undefined) {
      if (typeof fatPercentage !== 'number' || fatPercentage < 0 || fatPercentage > 10) {
        return res.status(400).json({ 
          error: 'Fat percentage must be a number between 0 and 10' 
        });
      }
      updateData.fatPercentage = fatPercentage;
    }

    if (snf !== undefined) {
      if (typeof snf !== 'number' || snf < 0 || snf > 15) {
        return res.status(400).json({ 
          error: 'SNF must be a number between 0 and 15' 
        });
      }
      updateData.snf = snf;
    }

    if (isBilled !== undefined) {
      updateData.isBilled = Boolean(isBilled);
    }

    // Update milk collection
    const updatedCollection = await prisma.milkCollection.update({
      where: { id },
      data: updateData,
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
      message: 'Milk collection updated successfully',
      milkCollection: updatedCollection
    });

  } catch (error) {
    console.error('Update milk collection error:', error);
    res.status(500).json({ error: 'Failed to update milk collection' });
  }
};

/**
 * Delete a milk collection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteMilkCollection = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if milk collection exists
    const existingCollection = await prisma.milkCollection.findUnique({
      where: { id }
    });

    if (!existingCollection) {
      return res.status(404).json({ error: 'Milk collection not found' });
    }

    // Delete milk collection
    await prisma.milkCollection.delete({
      where: { id }
    });

    res.json({ message: 'Milk collection deleted successfully' });

  } catch (error) {
    console.error('Delete milk collection error:', error);
    res.status(500).json({ error: 'Failed to delete milk collection' });
  }
};

export {
  createMilkCollection,
  getAllMilkCollections,
  getMilkCollectionById,
  updateMilkCollection,
  deleteMilkCollection
};
