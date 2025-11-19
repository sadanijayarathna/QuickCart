import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user || !user._id) {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/user/${user._id}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, orderStatus) => {
    // Check if order can be cancelled
    if (orderStatus === 'Shipped' || orderStatus === 'Delivered') {
      alert('Cannot cancel order that has been shipped or delivered.');
      return;
    }

    if (orderStatus === 'Cancelled') {
      alert('This order is already cancelled.');
      return;
    }

    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Order cancelled successfully!');
        // Refresh orders
        fetchOrders();
      } else {
        alert(`Failed to cancel order: ${data.message}`);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': '#f39c12',
      'Confirmed': '#3498db',
      'Shipped': '#9b59b6',
      'Delivered': '#2ecc71',
      'Cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Pending': '#f39c12',
      'Paid': '#2ecc71',
      'Failed': '#e74c3c',
      'Refunded': '#95a5a6'
    };
    return colors[status] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <Navbar />
        <div className="my-orders-container">
          <div className="loading">Loading your orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <Navbar />
      <div className="my-orders-container">
        <h1 className="page-title">My Orders</h1>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchOrders} className="retry-btn">Retry</button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="no-orders">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11V6a3 3 0 0 1 6 0v5" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 11a6 6 0 0 0 6 0M15 11a6 6 0 0 1-6 0" stroke="#ccc" strokeWidth="1.5"/>
              <path d="M6 10h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9z" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/products')} className="shop-now-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-status-badges">
                    <span 
                      className="status-badge order-status"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus}
                    </span>
                    <span 
                      className="status-badge payment-status"
                      style={{ backgroundColor: getPaymentStatusColor(order.paymentStatus) }}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h5>{item.name}</h5>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span>Payment Method:</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Shipping:</span>
                    <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="detail-row total">
                    <span>Total Amount:</span>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>

                <div className="order-actions">
                  {order.orderStatus !== 'Cancelled' && 
                   order.orderStatus !== 'Shipped' && 
                   order.orderStatus !== 'Delivered' && (
                    <button 
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order._id, order.orderStatus)}
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.orderStatus === 'Cancelled' && (
                    <span className="cancelled-text">This order has been cancelled</span>
                  )}
                  {(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') && (
                    <span className="no-cancel-text">This order cannot be cancelled</span>
                  )}
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

export default MyOrders;
