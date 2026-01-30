import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input after search
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side - Logo */}
        <Link to="/home" className="navbar-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M3 3h2l.4 2M7 13h10l3-8H6.4" 
              stroke="#2e7d32" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle cx="10" cy="20" r="1" fill="#2e7d32"/>
            <circle cx="18" cy="20" r="1" fill="#2e7d32"/>
          </svg>
          <span className="navbar-brand">QuickCart</span>
        </Link>

        {/* Middle - Navigation Links */}
        <div className="navbar-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">All Products</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Right Side - Search, Cart, Login/Profile */}
        <div className="navbar-actions">
          {/* Search Box */}
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="#2e7d32" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </form>

          {/* Cart Icon with Count */}
          <Link to="/cart" className="cart-icon-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M3 3h2l.4 2M7 13h10l3-8H6.4" 
                stroke="#2e7d32" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1" fill="#2e7d32"/>
              <circle cx="18" cy="20" r="1" fill="#2e7d32"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Login Button or Profile Icon */}
          {!isAuthenticated ? (
            <Link to="/" className="login-btn">Login</Link>
          ) : (
            <div className="profile-container">
              <button 
                className="profile-icon" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="#2e7d32" strokeWidth="2"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-menu-header">
                    <span className="profile-name">{user?.fullName || 'User'}</span>
                    <span className="profile-email">{user?.email}</span>
                  </div>
                  <Link to="/my-orders" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                    My Orders
                  </Link>
                  <button className="profile-menu-item logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
