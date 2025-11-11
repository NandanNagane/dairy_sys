// FILE: src/api/reports/reports.controller.js

import prisma from '../../config/prisma.js';
import { generateFarmerStatement } from '../../utils/pdf.util.js';

/**
 * Generate PDF statement for a farmer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateFarmerStatementController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'startDate and endDate query parameters are required' 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format. Use YYYY-MM-DD format' 
      });
    }

    if (start >= end) {
      return res.status(400).json({ 
        error: 'startDate must be before endDate' 
      });
    }

    // Check if user exists and is a farmer
    const farmer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!farmer) {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    // Get milk collections for the period
    const milkCollections = await prisma.milkCollection.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: end
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get payments for the period
    const payments = await prisma.payment.findMany({
      where: {
        userId,
        OR: [
          {
            periodStartDate: {
              gte: start,
              lte: end
            }
          },
          {
            periodEndDate: {
              gte: start,
              lte: end
            }
          },
          {
            AND: [
              { periodStartDate: { lte: start } },
              { periodEndDate: { gte: end } }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    // Prepare data for PDF generation
    const reportData = {
      farmer,
      milkCollections,
      payments,
      dateRange: {
        startDate: start.toLocaleDateString(),
        endDate: end.toLocaleDateString()
      }
    };

    // Generate PDF
    const pdfDoc = generateFarmerStatement(reportData);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename="farmer-statement-${farmer.name.replace(/\s+/g, '-')}-${startDate}-to-${endDate}.pdf"`
    );

    // Stream PDF to response
    pdfDoc.pipe(res);
    pdfDoc.end();

  } catch (error) {
    console.error('Generate farmer statement error:', error);
    
    // If response hasn't been sent yet, send error
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate farmer statement' });
    }
  }
};

/**
 * Get dashboard statistics for admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get today's date range (start and end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get yesterday's date range
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Total milk collected today
    const todayCollections = await prisma.milkCollection.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        quantity: true
      },
      _avg: {
        fatPercentage: true,
        snf: true
      }
    });

    // Yesterday's total for comparison
    const yesterdayCollections = await prisma.milkCollection.aggregate({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        }
      },
      _sum: {
        quantity: true
      }
    });

    // Total pending payments (PENDING status)
    const pendingPayments = await prisma.payment.aggregate({
      where: {
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    });

    // Total farmers count
    const farmerCount = await prisma.user.count({
      where: {
        role: 'FARMER'
      }
    });

    // Calculate percentage change from yesterday
    const todayTotal = todayCollections._sum.quantity || 0;
    const yesterdayTotal = yesterdayCollections._sum.quantity || 0;
    let percentageChange = 0;
    
    if (yesterdayTotal > 0) {
      percentageChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
    }

    // Prepare response
    const stats = {
      totalMilkToday: todayTotal,
      percentageChange: Math.round(percentageChange * 10) / 10, // Round to 1 decimal
      avgFatContent: todayCollections._avg.fatPercentage 
        ? Math.round(todayCollections._avg.fatPercentage * 10) / 10 
        : 0,
      avgSnf: todayCollections._avg.snf 
        ? Math.round(todayCollections._avg.snf * 10) / 10 
        : 0,
      payoutDue: pendingPayments._sum.amount || 0,
      farmerCount: farmerCount
    };

    res.json(stats);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

export {
  generateFarmerStatementController as generateFarmerStatement,
  getDashboardStats
};
