const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit/Debit Card', 'PayPal', 'Cash on Delivery', 'Other']
  },
  cardLastFour: {
    type: String,
    default: null
  },
  transactionId: {
    type: String,
    default: function() {
      // Generate a unique transaction ID
      return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  transactionStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add index for faster queries
paymentSchema.index({ userId: 1, paymentDate: -1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ transactionStatus: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
