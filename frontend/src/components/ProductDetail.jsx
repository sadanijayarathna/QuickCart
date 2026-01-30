import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/ProductDetail.css';
import { toast, ToastContainer } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} item(s) to Cart!`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star">★</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="detail-container">
          <p className="loading">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="detail-container">
          <p className="error">Product not found.</p>
          <button onClick={() => navigate('/products')} className="back-btn">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar />
      <ToastContainer />
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back
        </button>
        
        <div className="detail-content">
          <div className="detail-image-section">
            <img src={product.image} alt={product.name} className="detail-image" />
          </div>

          <div className="detail-info-section">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            
            <div className="detail-rating">
              {renderStars(product.rating)}
              <span className="rating-number">({product.rating})</span>
              <span className="reviews-count">{product.reviews} reviews</span>
            </div>

            <div className="detail-price-section">
              <span className="detail-price">${product.price.toFixed(2)}</span>
              <span className="detail-weight">/ {product.weight}</span>
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="detail-stock">
              {product.inStock ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="detail-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart} 
                className="add-to-cart-btn-large"
                disabled={!product.inStock}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="20" r="1" fill="white"/>
                  <circle cx="18" cy="20" r="1" fill="white"/>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
