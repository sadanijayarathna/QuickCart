const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Online Payment']
  },
  paymentId: {
    type: String,
    default: null
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  orderNumber: {
    type: String,
    unique: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate unique order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
  }
  next();
});

// Add index for faster queries
orderSchema.index({ userId: 1, orderDate: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
