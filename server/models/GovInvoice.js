import mongoose from 'mongoose';

// Schema for invoice items
const govInvoiceItemSchema = new mongoose.Schema({
  hsCode: {
    type: String,
    required: true,
    match: /^[0-9]{4}\.[0-9]{4}$/,
    default: "0000.0000"
  },
  productDescription: {
    type: String,
    default: ""
  },
  rate: {
    type: String,
    required: true,
    match: /^[0-9]{1,2}(\.[0-9]{1,2})?%$/,
    default: "0%"
  },
  uoM: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalValues: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  valueSalesExcludingST: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  fixedNotifiedValueOrRetailPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  salesTaxApplicable: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  salesTaxWithheldAtSource: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  furtherTax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  fedPayable: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  extraTax: {
    type: mongoose.Schema.Types.Mixed, // Can be string or number
    default: "0%"
  },
  sroScheduleNo: {
    type: String,
    default: ""
  },
  saleType: {
    type: String,
    default: ""
  },
  sroItemSerialNo: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Main invoice schema
const govInvoiceSchema = new mongoose.Schema({
  invoiceType: {
    type: String,
    required: true,
    enum: ["Sale Invoice", "Credit Note", "Debit Note", "STWH"],
    default: "Sale Invoice"
  },
  invoiceDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  sellerNTNCNIC: {
    type: String,
    required: true,
    match: /^\d{7,15}$/
  },
  buyerNTNCNIC: {
    type: String,
    required: true,
    match: /^\d{7,15}$/
  },
  sellerBusinessName: {
    type: String,
    required: true,
    trim: true
  },
  buyerBusinessName: {
    type: String,
    required: true,
    trim: true
  },
  sellerAddress: {
    type: String,
    required: true,
    trim: true
  },
  buyerAddress: {
    type: String,
    required: true,
    trim: true
  },
  sellerProvince: {
    type: String,
    required: true,
    trim: true
  },
  buyerProvince: {
    type: String,
    required: true,
    trim: true
  },
  buyerRegistrationType: {
    type: String,
    required: true,
    enum: ["Registered", "Unregistered", "Unregistered Distributor", "Retail Consumer"],
    default: "Registered"
  },
  invoiceRefNo: {
    type: String,
    default: ""
  },
  scenarioId: {
    type: String,
    required: true,
    match: /^SN[0-9]{3}$/,
    default: "SN001"
  },
  items: {
    type: [govInvoiceItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'At least one item is required'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  submittedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
govInvoiceSchema.index({ invoiceDate: -1 });
govInvoiceSchema.index({ sellerNTNCNIC: 1 });
govInvoiceSchema.index({ buyerNTNCNIC: 1 });
govInvoiceSchema.index({ status: 1 });
govInvoiceSchema.index({ createdAt: -1 });

// Virtual for total invoice amount
govInvoiceSchema.virtual('totalAmount').get(function() {
  return this.items.reduce((total, item) => total + item.totalValues, 0);
});

// Ensure virtuals are serialized
govInvoiceSchema.set('toJSON', { virtuals: true });
govInvoiceSchema.set('toObject', { virtuals: true });

const GovInvoice = mongoose.model('GovInvoice', govInvoiceSchema);

export default GovInvoice; 