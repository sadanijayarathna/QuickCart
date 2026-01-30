#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 10

# Check if products collection is empty and seed if needed
echo "Checking if database needs seeding..."
node -e "
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/quickcart';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('Database is empty, seeding products...');
      const { spawn } = require('child_process');
      const seed = spawn('node', ['seedProducts.js']);
      
      seed.stdout.on('data', (data) => console.log(data.toString()));
      seed.stderr.on('data', (data) => console.error(data.toString()));
      
      seed.on('close', (code) => {
        console.log('Seeding completed with code', code);
        process.exit(0);
      });
    } else {
      console.log('Database already has products, skipping seed');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('Error checking database:', err);
    process.exit(1);
  });
"

# Start the main application
echo "Starting QuickCart backend server..."
npm start
