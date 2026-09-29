const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  symbol: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { timestamps: true }));
