const { spawn } = require('child_process');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/quickcart';
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000;

// Function to wait for MongoDB
async function waitForMongo(retries = 0) {
  try {
    await mongoose.connect(MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.log(`⏳ Waiting for MongoDB... (attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return waitForMongo(retries + 1);
    } else {
      console.error('❌ Could not connect to MongoDB after', MAX_RETRIES, 'attempts');
      throw err;
    }
  }
}

// Function to check and seed database
async function checkAndSeedDatabase() {
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('📦 Database is empty, seeding products...');
      
      return new Promise((resolve, reject) => {
        const seed = spawn('node', ['seedProducts.js']);
        
        seed.stdout.on('data', (data) => {
          console.log(data.toString().trim());
        });
        
        seed.stderr.on('data', (data) => {
          console.error(data.toString().trim());
        });
        
        seed.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Seeding completed successfully');
            resolve();
          } else {
            console.error('❌ Seeding failed with code', code);
            reject(new Error('Seeding failed'));
          }
        });
      });
    } else {
      console.log('✅ Database already has', count, 'products, skipping seed');
    }
  } catch (err) {
    console.error('❌ Error checking database:', err.message);
    throw err;
  }
}

// Main startup function
async function startup() {
  try {
    console.log('🚀 Starting QuickCart Backend...');
    
    // Wait for MongoDB
    await waitForMongo();
    
    // Check and seed database if needed
    await checkAndSeedDatabase();
    
    // Close the mongoose connection used for seeding
    await mongoose.connection.close();
    console.log('Closed seeding connection');
    
    // Start the main application
    console.log('🎯 Starting main server...');
    const server = spawn('node', ['server.js'], {
      stdio: 'inherit'
    });
    
    server.on('close', (code) => {
      console.log('Server exited with code', code);
      process.exit(code);
    });
    
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Run startup
startup();
