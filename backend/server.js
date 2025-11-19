require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Product = require('./models/Product');
const Contact = require('./models/Contact');
const Order = require('./models/Order');
const Payment = require('./models/Payment');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickcart';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo connect error:', err));

app.post('/api/signup', async (req, res) => {
  try{
    const { fullName, email, password, phone } = req.body;
    if(!fullName || !email || !password) return res.json({ success:false, message:'Missing fields' });

    const exists = await User.findOne({ email });
    if(exists) return res.json({ success:false, message:'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hash, phone });
    await user.save();
    return res.json({ success:true, message:'Account created' });
  }catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email || !password) return res.json({ success:false, message:'Missing fields' });

    const user = await User.findOne({ email });
    if(!user) return res.json({ success:false, message:'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.json({ success:false, message:'Invalid credentials' });

    return res.json({ 
      success:true, 
      message:'Login successful!',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone
    });
  }catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message:'Server error' });
  }
});

// Get all products or filter by category/search
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    // Filter by category if provided
    if (category) {
      filter.category = category;
    }
    
    // Filter by search query if provided (case-insensitive search in name, category, and description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter);
    return res.json({ success: true, products });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, product });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create product (for seeding/admin)
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    return res.json({ success: true, product });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.json({ success: false, message: 'All fields are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    return res.json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all contact messages (for admin)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== ORDER ROUTES ====================

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    console.log('Received order request:', orderData);
    
    // Validate required fields
    if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
      console.error('Order validation failed:', { 
        hasUserId: !!orderData.userId, 
        hasItems: !!orderData.items, 
        itemsLength: orderData.items?.length 
      });
      return res.status(400).json({ success: false, message: 'Invalid order data: missing userId or items' });
    }

    const order = new Order(orderData);
    await order.save();
    
    console.log('Order created successfully:', order._id);
    return res.status(201).json({ success: true, order, message: 'Order created successfully' });
  } catch(err) {
    console.error('Error creating order:', err);
    console.error('Error details:', err.message);
    return res.status(500).json({ success: false, message: `Failed to create order: ${err.message}` });
  }
});

// Get all orders for a specific user
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate('paymentId');
    
    return res.json({ success: true, orders });
  } catch(err) {
    console.error('Error fetching user orders:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get a specific order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('paymentId');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    return res.json({ success: true, order });
  } catch(err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Update order status
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    return res.json({ success: true, order, message: 'Order updated successfully' });
  } catch(err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ success: false, message: 'Failed to update order' });
  }
});

// Get all orders (for admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .populate('userId', 'fullName email')
      .populate('paymentId');
    
    return res.json({ success: true, orders });
  } catch(err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Cancel an order
app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Only allow cancellation if order is still processing
    if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel order that has been shipped or delivered' 
      });
    }
    
    order.orderStatus = 'Cancelled';
    await order.save();
    
    return res.json({ success: true, order, message: 'Order cancelled successfully' });
  } catch(err) {
    console.error('Error cancelling order:', err);
    return res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

// ==================== PAYMENT ROUTES ====================

// Create a new payment
app.post('/api/payments', async (req, res) => {
  try {
    const paymentData = req.body;
    
    console.log('Received payment request:', paymentData);
    
    // Validate required fields
    if (!paymentData.userId || !paymentData.amount || !paymentData.paymentMethod) {
      console.error('Payment validation failed:', { 
        hasUserId: !!paymentData.userId, 
        hasAmount: !!paymentData.amount, 
        hasMethod: !!paymentData.paymentMethod 
      });
      return res.status(400).json({ success: false, message: 'Invalid payment data: missing required fields' });
    }

    const payment = new Payment(paymentData);
    await payment.save();
    
    console.log('Payment created successfully:', payment._id);
    return res.status(201).json({ success: true, payment, message: 'Payment processed successfully' });
  } catch(err) {
    console.error('Error processing payment:', err);
    return res.status(500).json({ success: false, message: `Failed to process payment: ${err.message}` });
  }
});

// Get all payments for a specific user
app.get('/api/payments/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .sort({ paymentDate: -1 })
      .populate('orderId');
    
    return res.json({ success: true, payments });
  } catch(err) {
    console.error('Error fetching user payments:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Get a specific payment by ID
app.get('/api/payments/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate('orderId');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    return res.json({ success: true, payment });
  } catch(err) {
    console.error('Error fetching payment:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch payment' });
  }
});

// Get all payments (for admin)
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ paymentDate: -1 })
      .populate('userId', 'fullName email')
      .populate('orderId');
    
    return res.json({ success: true, payments });
  } catch(err) {
    console.error('Error fetching payments:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Update payment status
app.patch('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { transactionStatus } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { transactionStatus },
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    return res.json({ success: true, payment, message: 'Payment status updated' });
  } catch(err) {
    console.error('Error updating payment:', err);
    return res.status(500).json({ success: false, message: 'Failed to update payment' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
