// FILE: src/utils/pdf.util.js

const PDFDocument = require('pdfkit');

/**
 * Generate a farmer statement PDF
 * @param {Object} data - The data object containing farmer and transaction information
 * @param {Object} data.farmer - Farmer information
 * @param {Array} data.milkCollections - Array of milk collection records
 * @param {Array} data.payments - Array of payment records
 * @param {Object} data.dateRange - Date range for the statement
 * @returns {PDFDocument} - PDF document stream
 */
const generateFarmerStatement = (data) => {
  const doc = new PDFDocument({ margin: 50 });
  
  // Header
  doc.fontSize(20)
     .text('Smart Dairy Management System', 50, 50)
     .fontSize(16)
     .text('Farmer Statement Report', 50, 80);
  
  // Farmer Information
  doc.fontSize(12)
     .text(`Farmer Name: ${data.farmer.name}`, 50, 120)
     .text(`Email: ${data.farmer.email}`, 50, 140)
     .text(`Statement Period: ${data.dateRange.startDate} to ${data.dateRange.endDate}`, 50, 160)
     .text(`Generated On: ${new Date().toLocaleDateString()}`, 50, 180);
  
  // Line separator
  doc.moveTo(50, 200)
     .lineTo(550, 200)
     .stroke();
  
  let yPosition = 220;
  
  // Milk Collections Section
  if (data.milkCollections && data.milkCollections.length > 0) {
    doc.fontSize(14)
       .text('Milk Collections', 50, yPosition);
    
    yPosition += 30;
    
    // Table headers
    doc.fontSize(10)
       .text('Date', 50, yPosition)
       .text('Quantity (L)', 150, yPosition)
       .text('Fat %', 250, yPosition)
       .text('SNF %', 320, yPosition)
       .text('Status', 400, yPosition);
    
    yPosition += 20;
    
    // Table data
    let totalQuantity = 0;
    data.milkCollections.forEach((collection) => {
      if (yPosition > 700) { // Start new page if needed
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(9)
         .text(new Date(collection.createdAt).toLocaleDateString(), 50, yPosition)
         .text(collection.quantity.toString(), 150, yPosition)
         .text(collection.fatPercentage.toString(), 250, yPosition)
         .text(collection.snf.toString(), 320, yPosition)
         .text(collection.isBilled ? 'Billed' : 'Pending', 400, yPosition);
      
      totalQuantity += collection.quantity;
      yPosition += 15;
    });
    
    // Total quantity
    yPosition += 10;
    doc.fontSize(11)
       .text(`Total Quantity: ${totalQuantity.toFixed(2)} L`, 50, yPosition);
    
    yPosition += 30;
  }
  
  // Payments Section
  if (data.payments && data.payments.length > 0) {
    if (yPosition > 600) { // Start new page if needed
      doc.addPage();
      yPosition = 50;
    }
    
    doc.fontSize(14)
       .text('Payment History', 50, yPosition);
    
    yPosition += 30;
    
    // Table headers
    doc.fontSize(10)
       .text('Period Start', 50, yPosition)
       .text('Period End', 150, yPosition)
       .text('Amount (₹)', 280, yPosition)
       .text('Status', 380, yPosition)
       .text('Date', 450, yPosition);
    
    yPosition += 20;
    
    // Table data
    let totalPaid = 0;
    let totalPending = 0;
    
    data.payments.forEach((payment) => {
      if (yPosition > 700) { // Start new page if needed
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(9)
         .text(new Date(payment.periodStartDate).toLocaleDateString(), 50, yPosition)
         .text(new Date(payment.periodEndDate).toLocaleDateString(), 150, yPosition)
         .text(`₹${payment.amount.toFixed(2)}`, 280, yPosition)
         .text(payment.status, 380, yPosition)
         .text(new Date(payment.createdAt).toLocaleDateString(), 450, yPosition);
      
      if (payment.status === 'PAID') {
        totalPaid += payment.amount;
      } else {
        totalPending += payment.amount;
      }
      
      yPosition += 15;
    });
    
    // Payment summary
    yPosition += 20;
    doc.fontSize(11)
       .text(`Total Paid: ₹${totalPaid.toFixed(2)}`, 50, yPosition)
       .text(`Total Pending: ₹${totalPending.toFixed(2)}`, 250, yPosition);
    
    yPosition += 15;
    doc.fontSize(12)
       .text(`Grand Total: ₹${(totalPaid + totalPending).toFixed(2)}`, 50, yPosition);
  }
  
  // Footer
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(8)
       .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
         align: 'center'
       });
  }
  
  return doc;
};

/**
 * Generate a summary report PDF
 * @param {Object} data - The data object containing summary information
 * @returns {PDFDocument} - PDF document stream
 */
const generateSummaryReport = (data) => {
  const doc = new PDFDocument({ margin: 50 });
  
  // Header
  doc.fontSize(20)
     .text('Dairy Management Summary Report', 50, 50)
     .fontSize(12)
     .text(`Generated On: ${new Date().toLocaleDateString()}`, 50, 80);
  
  // Summary statistics
  let yPosition = 120;
  
  if (data.totalFarmers !== undefined) {
    doc.text(`Total Farmers: ${data.totalFarmers}`, 50, yPosition);
    yPosition += 20;
  }
  
  if (data.totalMilkCollected !== undefined) {
    doc.text(`Total Milk Collected: ${data.totalMilkCollected.toFixed(2)} L`, 50, yPosition);
    yPosition += 20;
  }
  
  if (data.totalPayments !== undefined) {
    doc.text(`Total Payments: ₹${data.totalPayments.toFixed(2)}`, 50, yPosition);
    yPosition += 20;
  }
  
  if (data.totalExpenses !== undefined) {
    doc.text(`Total Expenses: ₹${data.totalExpenses.toFixed(2)}`, 50, yPosition);
    yPosition += 20;
  }
  
  return doc;
};

module.exports = {
  generateFarmerStatement,
  generateSummaryReport
};
