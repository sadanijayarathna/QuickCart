import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Organic Veggies', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
    { name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300' },
    { name: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300' },
    { name: 'Instant Food', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300' },
    { name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300' },
    { name: 'Bakery & Breads', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' },
    { name: 'Grains & Cereals', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300' }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-container">
        {/* Hero Section with Real Image */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to QuickCart</h1>
            <p className="hero-subtitle">Freshness You Can Trust, Savings You will Love!</p>
            <button className="hero-btn" onClick={() => navigate('/products')}>Shop Now</button>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" 
              alt="Fresh vegetables and fruits"
              className="hero-img"
            />
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <h2 className="section-title">Categories</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="category-card"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} className="category-image" />
                </div>
                <h3 className="category-name">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Shop With Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your products delivered quickly to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment methods for your peace of mind</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>Quality Products</h3>
              <p>Wide range of high-quality products at great prices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Customer support available round the clock</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Start Shopping Today!</h2>
          <p>Browse through our amazing collection of products</p>
          <button className="cta-btn" onClick={() => navigate('/products')}>View All Products</button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
