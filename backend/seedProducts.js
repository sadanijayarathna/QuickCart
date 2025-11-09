require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickcart';

const products = [
  // Organic Veggies
  {
    name: 'Fresh Potato',
    category: 'Organic Veggies',
    price: 2.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    rating: 4.5,
    reviews: 120,
    description: 'Fresh organic potatoes, perfect for all your cooking needs.',
    stock: 50,
    inStock: true
  },
  {
    name: 'Red Tomato',
    category: 'Organic Veggies',
    price: 3.49,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    rating: 4.7,
    reviews: 95,
    description: 'Juicy red tomatoes, organically grown and pesticide-free.',
    stock: 40,
    inStock: true
  },
  {
    name: 'Green Cucumber',
    category: 'Organic Veggies',
    price: 1.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400',
    rating: 4.3,
    reviews: 78,
    description: 'Crisp and fresh cucumbers, great for salads.',
    stock: 60,
    inStock: true
  },
  {
    name: 'Carrot',
    category: 'Organic Veggies',
    price: 2.49,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    rating: 4.6,
    reviews: 110,
    description: 'Sweet and crunchy organic carrots.',
    stock: 45,
    inStock: true
  },
  {
    name: 'Spinach',
    category: 'Organic Veggies',
    price: 2.99,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    rating: 4.5,
    reviews: 88,
    description: 'Fresh organic spinach leaves, rich in iron.',
    stock: 35,
    inStock: true
  },
  {
    name: 'Bell Pepper',
    category: 'Organic Veggies',
    price: 3.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
    rating: 4.7,
    reviews: 92,
    description: 'Colorful bell peppers, sweet and crunchy.',
    stock: 55,
    inStock: true
  },

  // Fresh Fruits
  {
    name: 'Red Apple',
    category: 'Fresh Fruits',
    price: 4.99,
    weight: '1kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    rating: 4.8,
    reviews: 150,
    description: 'Crisp and sweet red apples, rich in nutrients.',
    stock: 80,
    inStock: true
  },
  {
    name: 'Banana',
    category: 'Fresh Fruits',
    price: 3.99,
    weight: '1kg',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    rating: 4.5,
    reviews: 200,
    description: 'Fresh yellow bananas, perfect for snacking.',
    stock: 100,
    inStock: true
  },
  {
    name: 'Orange',
    category: 'Fresh Fruits',
    price: 5.49,
    weight: '1kg',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400',
    rating: 4.7,
    reviews: 130,
    description: 'Juicy oranges packed with vitamin C.',
    stock: 70,
    inStock: true
  },
  {
    name: 'Strawberry',
    category: 'Fresh Fruits',
    price: 6.99,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    rating: 4.9,
    reviews: 180,
    description: 'Sweet and fresh strawberries.',
    stock: 30,
    inStock: true
  },
  {
    name: 'Mango',
    category: 'Fresh Fruits',
    price: 5.99,
    weight: '1kg',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
    rating: 4.8,
    reviews: 165,
    description: 'Sweet and juicy mangoes.',
    stock: 45,
    inStock: true
  },
  {
    name: 'Grapes',
    category: 'Fresh Fruits',
    price: 7.49,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400',
    rating: 4.6,
    reviews: 142,
    description: 'Fresh seedless grapes.',
    stock: 60,
    inStock: true
  },

  // Cold Drinks
  {
    name: 'Orange Juice',
    category: 'Cold Drinks',
    price: 3.99,
    weight: '1L',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    rating: 4.4,
    reviews: 85,
    description: 'Fresh orange juice, 100% natural.',
    stock: 50,
    inStock: true
  },
  {
    name: 'Cola Drink',
    category: 'Cold Drinks',
    price: 2.49,
    weight: '500ml',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    rating: 4.2,
    reviews: 220,
    description: 'Refreshing cola soft drink.',
    stock: 120,
    inStock: true
  },
  {
    name: 'Mineral Water',
    category: 'Cold Drinks',
    price: 1.99,
    weight: '1L',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    rating: 4.6,
    reviews: 300,
    description: 'Pure mineral water.',
    stock: 200,
    inStock: true
  },
  {
    name: 'Lemon Soda',
    category: 'Cold Drinks',
    price: 2.99,
    weight: '500ml',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
    rating: 4.3,
    reviews: 156,
    description: 'Refreshing lemon flavored soda.',
    stock: 110,
    inStock: true
  },
  {
    name: 'Iced Tea',
    category: 'Cold Drinks',
    price: 3.49,
    weight: '500ml',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    rating: 4.5,
    reviews: 198,
    description: 'Chilled iced tea with natural flavors.',
    stock: 95,
    inStock: true
  },

  // Instant Food
  {
    name: 'Instant Noodles',
    category: 'Instant Food',
    price: 2.99,
    weight: '400g',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    rating: 4.3,
    reviews: 250,
    description: 'Quick and tasty instant noodles.',
    stock: 150,
    inStock: true
  },
  {
    name: 'Instant Biriyani',
    category: 'Instant Food',
    price: 5.99,
    weight: '250g',
    image: 'https://www.rashanpani.co.uk/wp-content/uploads/2022/02/NationalSindhiBiryani41g-2.png',
    rating: 4.8,
    reviews: 220,
    description: 'Delicious instant biriyani, authentic flavors.',
    stock: 75,
    inStock: true
  },
  {
    name: 'Instant Soup',
    category: 'Instant Food',
    price: 3.49,
    weight: '300g',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    rating: 4.4,
    reviews: 134,
    description: 'Quick and warming instant soup mix.',
    stock: 85,
    inStock: true
  },
  {
    name: 'Ramen',
    category: 'Instant Food',
    price: 2.49,
    weight: '75g',
    image: 'https://tse1.mm.bing.net/th/id/OIP.Ab3dRaN5_mx9NXHe0hO_xwHaHz?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    rating: 4.2,
    reviews: 267,
    description: 'Convenient ramen, just add hot water.',
    stock: 175,
    inStock: true
  },
  {
    name: 'Instant Pasta',
    category: 'Instant Food',
    price: 3.99,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    rating: 4.3,
    reviews: 145,
    description: 'Quick-cook pasta with seasoning.',
    stock: 95,
    inStock: true
  },

  // Dairy Products
  {
    name: 'Fresh Milk',
    category: 'Dairy Products',
    price: 3.49,
    weight: '1L',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    rating: 4.8,
    reviews: 320,
    description: 'Fresh whole milk from local farms.',
    stock: 100,
    inStock: true
  },
  {
    name: 'Cheddar Cheese',
    category: 'Dairy Products',
    price: 5.99,
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400',
    rating: 4.7,
    reviews: 140,
    description: 'Aged cheddar cheese, perfect for sandwiches.',
    stock: 60,
    inStock: true
  },
  {
    name: 'Greek Yogurt',
    category: 'Dairy Products',
    price: 4.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    rating: 4.6,
    reviews: 110,
    description: 'Creamy Greek yogurt, high in protein.',
    stock: 70,
    inStock: true
  },
  {
    name: 'Butter',
    category: 'Dairy Products',
    price: 4.49,
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    rating: 4.7,
    reviews: 156,
    description: 'Fresh creamy butter for cooking and baking.',
    stock: 80,
    inStock: true
  },
  {
    name: 'Cream',
    category: 'Dairy Products',
    price: 3.99,
    weight: '300ml',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
    rating: 4.5,
    reviews: 98,
    description: 'Fresh dairy cream for desserts and cooking.',
    stock: 55,
    inStock: true
  },

  // Bakery & Breads
  {
    name: 'White Bread',
    category: 'Bakery & Breads',
    price: 2.99,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    rating: 4.4,
    reviews: 200,
    description: 'Soft and fresh white bread.',
    stock: 80,
    inStock: true
  },
  {
    name: 'Croissant',
    category: 'Bakery & Breads',
    price: 3.99,
    weight: '6 pcs',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    rating: 4.9,
    reviews: 180,
    description: 'Buttery French croissants.',
    stock: 40,
    inStock: true
  },
  {
    name: 'Bagels',
    category: 'Bakery & Breads',
    price: 4.49,
    weight: '4 pcs',
    image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400',
    rating: 4.5,
    reviews: 95,
    description: 'Fresh baked bagels.',
    stock: 50,
    inStock: true
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Bakery & Breads',
    price: 3.49,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400',
    rating: 4.6,
    reviews: 178,
    description: 'Healthy whole wheat bread.',
    stock: 65,
    inStock: true
  },
  {
    name: 'Muffins',
    category: 'Bakery & Breads',
    price: 5.99,
    weight: '6 pcs',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400',
    rating: 4.8,
    reviews: 167,
    description: 'Delicious assorted muffins.',
    stock: 45,
    inStock: true
  },

  // Grains & Cereals
  {
    name: 'Green Beans',
    category: 'Grains & Cereals',
    price: 3.99,
    weight: '500g',
    image: 'https://lirp.cdn-website.com/0d0a6c3f/dms3rep/multi/opt/Surti-papdi-Lilva-312g-1920w.jpg',
    rating: 4.6,
    reviews: 160,
    description: 'Fresh green beans, crisp and nutritious.',
    stock: 120,
    inStock: true
  },
  {
    name: 'Red Peas',
    category: 'Grains & Cereals',
    price: 2.99,
    weight: '500g',
    image: 'https://th.bing.com/th/id/R.b69c46c2b612e83f23f2e91425f582cd?rik=rhleX4e%2fDdnZfw&pid=ImgRaw&r=0',
    rating: 4.7,
    reviews: 210,
    description: 'Sweet red peas, perfect for any meal.',
    stock: 100,
    inStock: true
  },
  {
    name: 'Cornflakes',
    category: 'Grains & Cereals',
    price: 4.99,
    weight: '500g',
    image: 'https://tse3.mm.bing.net/th/id/OIP.59Nn-lvzMnx0iKYOSKNbkQHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    rating: 4.4,
    reviews: 190,
    description: 'Crispy cornflakes cereal.',
    stock: 90,
    inStock: true
  },
  {
    name: 'Rice',
    category: 'Grains & Cereals',
    price: 8.99,
    weight: '1kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    rating: 4.8,
    reviews: 145,
    description: 'Premium quality rice, perfect for all dishes.',
    stock: 75,
    inStock: true
  },
  {
    name: 'Sweet Corn',
    category: 'Grains & Cereals',
    price: 3.49,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
    rating: 4.5,
    reviews: 188,
    description: 'Fresh sweet corn, naturally sweet and delicious.',
    stock: 110,
    inStock: true
  },
  {
    name: 'Papaya',
    category: 'Fresh Fruits',
    price: 4.99,
    weight: '1kg',
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400',
    rating: 4.7,
    reviews: 167,
    description: 'Fresh and sweet papaya, rich in vitamins.',
    stock: 85,
    inStock: true
  }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
