import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Products.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';\nimport API_BASE_URL from '../config';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery]);

  const fetchProducts = async () => {
    try {
      let url = `${API_BASE_URL}/api/products`;
      const params = [];
      
      if (category) {
        params.push(`category=${encodeURIComponent(category)}`);
      }
      if (searchQuery) {
        params.push(`search=${encodeURIComponent(searchQuery)}`);
      }
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Added to Cart!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="products-page">
        <Navbar />
        <div className="products-container">
          <p className="loading">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Navbar />
      <ToastContainer />
      <div className="products-container">
        <div className="products-header">
          <button onClick={() => navigate('/home')} className="back-to-home-btn">
            ← Back to Home
          </button>
          <h1 className="page-title">
            {searchQuery ? `Search Results for "${searchQuery}"` : (category || 'All Products')}
          </h1>
        </div>
        {products.length === 0 ? (
          <p className="no-products">
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products found.'}
          </p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div 
                  className="product-image-wrapper"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <h3 
                    className="product-name"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {product.name}
                  </h3>
                  <p className="product-weight">{product.weight}</p>
                  <div className="product-rating">
                    {renderStars(Math.floor(product.rating))}
                    <span className="reviews">({product.reviews})</span>
                  </div>
                  <div className="product-footer">
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="10" cy="20" r="1" fill="white"/>
                        <circle cx="18" cy="20" r="1" fill="white"/>
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Products;
