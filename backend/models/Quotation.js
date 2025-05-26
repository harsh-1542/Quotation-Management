// models/Quotation.js
const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  productName: { type: String, required: true },
  brand: { type: String, required: true },
  size: { type: String, required: true },
  ratePerSqft: { type: Number, required: true },
  withGST: { type: Boolean, default: false },
  totalQuantity: { type: Number, required: true },
  totalSqft: { type: Number, required: true },
  price: { type: Number, required: true },
  transportationCharge: { type: Number, default: 0 },
  labourCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);