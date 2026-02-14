import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/OrderSummary.css';

const OrderSummary = () => {
  const { cartItems, getCartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || user?.username || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99;
  };

  const calculateTotal = () => {
    return (calculateSubtotal() + calculateShipping()).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleProceedToPayment = async () => {
    // Validate shipping address
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    const isAddressComplete = requiredFields.every(field => shippingAddress[field].trim() !== '');

    if (!isAddressComplete) {
      alert('Please fill in all shipping address fields');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'online') {
      // Navigate to payment page for online payment
      const orderData = {
        shippingAddress, 
        cartItems, 
        subtotal: calculateSubtotal(),
        shippingCost: calculateShipping(),
        total: calculateTotal()
      };
      
      console.log('Navigating to payment with data:', orderData);
      
      navigate('/payment', { 
        state: orderData
      });
    } else if (paymentMethod === 'cod') {
      // Process Cash on Delivery order
      try {
        // Check if user is logged in
        if (!user || !user._id) {
          alert('Please log in to place an order.');
          navigate('/');
          return;
        }

        const orderData = {
          userId: String(user._id),
          items: cartItems.map(item => ({
            productId: String(item._id),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          shippingAddress,
          paymentMethod: 'Cash on Delivery',
          subtotal: calculateSubtotal(),
          shippingCost: calculateShipping(),
          totalAmount: parseFloat(calculateTotal()),
          paymentStatus: 'Pending',
          orderStatus: 'Processing'
        };

        console.log('Sending order data:', orderData);

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        console.log('Order response:', result);

        if (response.ok && result.success) {
          clearCart();
          setOrderDetails({
            orderId: result.order._id,
            orderNumber: result.order.orderNumber || result.order._id.slice(-8).toUpperCase(),
            paymentMethod: 'Cash on Delivery',
            totalAmount: result.order.totalAmount
          });
          setOrderSuccess(true);
        } else {
          alert(`Failed to place order: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert(`Failed to place order. Error: ${error.message}`);
      }
    }
  };

  // Show success modal after order is placed
  if (orderSuccess && orderDetails) {
    return (
      <div className="order-summary-page">
        <Navbar />
        <div className="order-summary-container">
          <div className="order-success-modal">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <div className="order-success-details">
              <p className="order-number">Order Number: <strong>#{orderDetails.orderNumber}</strong></p>
              <p className="payment-method">Payment Method: <strong>{orderDetails.paymentMethod}</strong></p>
              <p className="total-amount">Total Amount: <strong>${orderDetails.totalAmount.toFixed(2)}</strong></p>
              {orderDetails.paymentMethod === 'Cash on Delivery' && (
                <p className="cod-note">💵 You will pay cash when your order is delivered</p>
              )}
            </div>
            <div className="success-actions">
              <button 
                onClick={() => navigate('/my-orders')} 
                className="view-orders-btn"
              >
                📦 View My Orders
              </button>
              <button 
                onClick={() => navigate('/products')} 
                className="continue-shopping-btn"
              >
                🛍️ Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="order-summary-page">
        <Navbar />
        <div className="order-summary-container">
          <h1 className="page-title">Order Summary</h1>
          <div className="empty-order">
            <p>Your cart is empty. Please add items to proceed.</p>
            <button onClick={() => navigate('/products')} className="shop-btn">
              Go to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-summary-page">
      <Navbar />
      <div className="order-summary-container">
        <h1 className="page-title">Order Summary</h1>
        
        <div className="order-content">
          {/* Order Items Section */}
          <div className="order-items-section">
            <h2>Order Items ({getCartCount()} items)</h2>
            <div className="order-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h3>{item.name}</h3>
                    <p className="item-weight">{item.weight}</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address Section */}
            <div className="shipping-address-section">
              <h2>Shipping Address</h2>
              <div className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State/Province *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP/Postal Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter ZIP code"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Summary Section */}
          <div className="payment-summary-section">
            <div className="payment-method-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <div 
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('cod')}
                >
                  <div className="payment-radio">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                    />
                    <label htmlFor="cod">
                      <span className="payment-icon">💵</span>
                      <div>
                        <h3>Cash on Delivery</h3>
                        <p>Pay with cash when your order is delivered</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div 
                  className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodChange('online')}
                >
                  <div className="payment-radio">
                    <input
                      type="radio"
                      id="online"
                      name="payment"
                      checked={paymentMethod === 'online'}
                      onChange={() => handlePaymentMethodChange('online')}
                    />
                    <label htmlFor="online">
                      <span className="payment-icon">💳</span>
                      <div>
                        <h3>Online Payment</h3>
                        <p>Pay securely with your credit/debit card</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-total-section">
              <h2>Order Total</h2>
              <div className="total-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}</span>
              </div>
              {calculateSubtotal() < 50 && (
                <p className="free-shipping-note">Free shipping on orders over $50</p>
              )}
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
              <button 
                className="proceed-payment-btn"
                onClick={handleProceedToPayment}
              >
                {paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order'}
              </button>
              <button 
                onClick={() => navigate('/cart')} 
                className="back-to-cart-btn"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSummary;
