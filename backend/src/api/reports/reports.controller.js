// FILE: src/api/reports/reports.controller.js

const { PrismaClient } = require('@prisma/client');
const { generateFarmerStatement } = require('../../utils/pdf.util');

const prisma = new PrismaClient();

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

module.exports = {
  generateFarmerStatement: generateFarmerStatementController
};
