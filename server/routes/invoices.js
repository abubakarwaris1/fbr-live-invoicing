import express from 'express';
import GovInvoice from '../models/GovInvoice.js';

const router = express.Router();

// GET /api/gov-invoices - Get all invoices
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sellerNTNCNIC, buyerNTNCNIC } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (sellerNTNCNIC) filter.sellerNTNCNIC = sellerNTNCNIC;
    if (buyerNTNCNIC) filter.buyerNTNCNIC = buyerNTNCNIC;

    const skip = (page - 1) * limit;
    
    const invoices = await GovInvoice.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items');

    const total = await GovInvoice.countDocuments(filter);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
});

// GET /api/gov-invoices/:id - Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await GovInvoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
});

// POST /api/gov-invoices - Create new invoice
router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // Set status to submitted when creating
    invoiceData.status = 'submitted';
    invoiceData.submittedAt = new Date();

    const invoice = new GovInvoice(invoiceData);
    const savedInvoice = await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: savedInvoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
});

// PUT /api/gov-invoices/:id - Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await GovInvoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: error.message
    });
  }
});

// DELETE /api/gov-invoices/:id - Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await GovInvoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete invoice',
      error: error.message
    });
  }
});

// PATCH /api/gov-invoices/:id/status - Update invoice status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'submitted', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const invoice = await GovInvoice.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        submittedAt: status === 'submitted' ? new Date() : undefined
      },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status',
      error: error.message
    });
  }
});

export default router; 