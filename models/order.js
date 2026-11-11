const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [String], // Array of strings, e.g., ["Laptop", "Mouse"]
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'Pending' }, // Pending, Processing, Completed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);