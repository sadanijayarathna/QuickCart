const mongoose = require('mongoose');

async function fixOrdersIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/quickcart');
    console.log('Connected to MongoDB');

    // Get the orders collection
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // Drop the problematic orderNumber index
    try {
      await ordersCollection.dropIndex('orderNumber_1');
      console.log('Dropped orderNumber_1 index');
    } catch (error) {
      console.log('Index may not exist or already dropped');
    }

    // Create the correct unique index
    await ordersCollection.createIndex({ orderNumber: 1 }, { unique: true });
    console.log('Created new unique orderNumber index');

    console.log('\nDatabase fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

fixOrdersIndex();
