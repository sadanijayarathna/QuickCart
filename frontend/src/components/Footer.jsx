import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            QuickCart
          </h3>
          <p className="footer-description">Your one-stop shop for fresh groceries and daily essentials. Quality products delivered to your doorstep.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/products">All Products</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/cart">Shopping Cart</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul className="footer-links">
            <li><a href="/products?category=Organic%20Veggies">Organic Veggies</a></li>
            <li><a href="/products?category=Fresh%20Fruits">Fresh Fruits</a></li>
            <li><a href="/products?category=Dairy%20Products">Dairy Products</a></li>
            <li><a href="/products?category=Bakery%20%26%20Breads">Bakery & Breads</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul className="footer-contact">
            <li>📧 support@quickcart.com</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>📍 123 Main Street, City, State 12345</li>
            <li>🕒 Mon-Sat: 8AM - 10PM</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 QuickCart. All rights reserved.</p>
        <div className="footer-social">
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📷</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
