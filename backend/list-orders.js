const mongoose = require('mongoose');
const Order = require('./models/Order');

async function listOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickcart');
    const orders = await Order.find().sort({ orderDate: -1 }).limit(50).lean();
    console.log(`Found ${orders.length} orders:`);
    orders.forEach(o => {
      console.log('---');
      console.log('id:', o._id);
      console.log('orderNumber:', o.orderNumber);
      console.log('userId:', o.userId);
      console.log('paymentMethod:', o.paymentMethod);
      console.log('paymentStatus:', o.paymentStatus);
      console.log('orderStatus:', o.orderStatus);
      console.log('totalAmount:', o.totalAmount);
      console.log('orderDate:', o.orderDate);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing orders:', err);
    process.exit(1);
  }
}

listOrders();
