require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Product = require('./models/Product');
const Contact = require('./models/Contact');

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
      fullName: user.fullName,
      email: user.email
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
