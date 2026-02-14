import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const { shippingAddress, cartItems, subtotal, shippingCost, total } = location.state || {};
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingAddress: shippingAddress?.address || '',
    billingCity: shippingAddress?.city || '',
    billingZip: shippingAddress?.zipCode || ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Redirect if no order data
  if (!shippingAddress || !cartItems || !total) {
    console.error('Missing order data:', { shippingAddress, cartItems, subtotal, shippingCost, total });
    alert('Order data is missing. Please start from the cart.');
    navigate('/cart');
    return null;
  }

  // Log received data for debugging
  console.log('Payment page received:', { 
    shippingAddress, 
    cartItems, 
    subtotal, 
    shippingCost, 
    total,
    user 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.slice(0, 19); // Max 16 digits + 3 spaces
    }

    // Format CVV (numbers only, max 4 digits)
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    // Format expiry month and year (numbers only)
    if (name === 'expiryMonth') {
      formattedValue = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(formattedValue) > 12) formattedValue = '12';
    }

    if (name === 'expiryYear') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation (16 digits) - TEST MODE: Accept any 16 digits
    const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    } else if (!/^\d+$/.test(cardNumberDigits)) {
      newErrors.cardNumber = 'Card number must contain only digits';
    }

    // Cardholder name validation
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    // Expiry validation
    if (!cardDetails.expiryMonth) {
      newErrors.expiryMonth = 'Month is required';
    } else if (parseInt(cardDetails.expiryMonth) < 1 || parseInt(cardDetails.expiryMonth) > 12) {
      newErrors.expiryMonth = 'Invalid month (1-12)';
    }
    
    if (!cardDetails.expiryYear) {
      newErrors.expiryYear = 'Year is required';
    } else if (cardDetails.expiryYear.length !== 4) {
      newErrors.expiryYear = 'Year must be 4 digits';
    }

    // Check if card is expired (lenient for testing - only check if it's reasonable)
    if (cardDetails.expiryMonth && cardDetails.expiryYear) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const expiryYear = parseInt(cardDetails.expiryYear);
      const expiryMonth = parseInt(cardDetails.expiryMonth);

      // Only reject if clearly expired (more than 1 year old)
      if (expiryYear < currentYear - 1 || (expiryYear === currentYear - 1 && expiryMonth < currentMonth)) {
        newErrors.expiryMonth = 'Card appears to be expired';
      }
    }

    // CVV validation - TEST MODE: Accept any 3-4 digits
    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardDetails.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }

    // Billing address validation
    if (!cardDetails.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }
    if (!cardDetails.billingCity.trim()) {
      newErrors.billingCity = 'City is required';
    }
    if (!cardDetails.billingZip.trim()) {
      newErrors.billingZip = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    // Check if user is logged in
    if (!user || !user._id) {
      alert('Please log in to complete payment.');
      navigate('/');
      return;
    }

    // Validate we have all necessary data
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty. Please add items first.');
      navigate('/cart');
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName) {
      alert('Shipping address is missing. Please go back and fill it in.');
      navigate('/order-summary');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('=== STARTING PAYMENT PROCESS ===');
      console.log('User:', user);
      console.log('Cart Items:', cartItems);
      console.log('Subtotal:', subtotal);
      console.log('Shipping Cost:', shippingCost);
      console.log('Total:', total);

      // Calculate values if not provided
      const calculatedSubtotal = subtotal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const calculatedShipping = shippingCost !== undefined ? shippingCost : (calculatedSubtotal > 50 ? 0 : 5.99);
      const calculatedTotal = total || (calculatedSubtotal + calculatedShipping).toFixed(2);

      console.log('Calculated values:', {
        subtotal: calculatedSubtotal,
        shipping: calculatedShipping,
        total: calculatedTotal
      });

      // Step 1: Create payment record
      const paymentData = {
        userId: user._id,
        amount: parseFloat(calculatedTotal),
        paymentMethod: 'Credit/Debit Card',
        cardLastFour: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
        transactionStatus: 'Completed'
      };

      console.log('Step 1: Creating payment...', paymentData);

      const paymentResponse = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('Payment API error:', errorText);
        throw new Error(`Payment API returned ${paymentResponse.status}: ${errorText}`);
      }

      const paymentResult = await paymentResponse.json();
      console.log('Payment created successfully:', paymentResult);

      if (!paymentResult.success || !paymentResult.payment) {
        throw new Error(paymentResult.message || 'Payment processing failed');
      }

      const payment = paymentResult.payment;

      // Step 2: Create order with payment reference
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
        paymentMethod: 'Online Payment',
        paymentId: String(payment._id),
        subtotal: parseFloat(calculatedSubtotal),
        shippingCost: parseFloat(calculatedShipping),
        totalAmount: parseFloat(calculatedTotal),
        paymentStatus: 'Paid',
        orderStatus: 'Processing'
      };

      console.log('Step 2: Creating order...', orderData);

      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order API error:', errorText);
        throw new Error(`Order API returned ${orderResponse.status}: ${errorText}`);
      }

      const orderResult = await orderResponse.json();
      console.log('Order created successfully:', orderResult);

      if (!orderResult.success || !orderResult.order) {
        throw new Error(orderResult.message || 'Order creation failed');
      }

      const order = orderResult.order;
      
      // Step 3: Clear cart and show success
      console.log('Step 3: Payment and order completed successfully!');
      clearCart();
      setOrderDetails({
        orderId: order._id,
        orderNumber: order.orderNumber || order._id.slice(-8).toUpperCase(),
        transactionId: payment.transactionId,
        paymentMethod: 'Online Payment',
        totalAmount: parseFloat(calculatedTotal),
        cardLastFour: cardDetails.cardNumber.replace(/\s/g, '').slice(-4)
      });
      setPaymentSuccess(true);
      setIsProcessing(false);
      
    } catch (error) {
      console.error('=== PAYMENT ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`❌ Payment Failed\n\nError: ${error.message}\n\nPlease check the console for more details or try again.`);
      setIsProcessing(false);
    }
  };

  const getCardType = () => {
    const firstDigit = cardDetails.cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    return 'Card';
  };

  // Show success screen after payment
  if (paymentSuccess && orderDetails) {
    return (
      <div className="payment-page">
        <Navbar />
        <div className="payment-container">
          <div className="payment-success-modal">
            <div className="success-icon">✓</div>
            <h1>Payment Successful!</h1>
            <div className="payment-success-details">
              <p className="transaction-id">Transaction ID: <strong>{orderDetails.transactionId}</strong></p>
              <p className="order-number">Order Number: <strong>#{orderDetails.orderNumber}</strong></p>
              <p className="payment-method">Payment Method: <strong>{orderDetails.paymentMethod}</strong></p>
              <p className="card-used">Card: <strong>**** **** **** {orderDetails.cardLastFour}</strong></p>
              <p className="total-amount">Amount Paid: <strong>${orderDetails.totalAmount.toFixed(2)}</strong></p>
              <p className="success-message">✨ Thank you for your purchase! Your order is being processed.</p>
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

  return (
    <div className="payment-page">
      <Navbar />
      <div className="payment-container">
        <h1 className="page-title">Payment Details</h1>
        
        <div className="payment-content">
          <div className="payment-form-section">
            <form onSubmit={handleSubmitPayment} className="payment-form">
              <div className="form-section">
                <h2>Card Information</h2>
                
                <div className="form-group">
                  <label>Card Number *</label>
                  <div className="card-input-wrapper">
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    <span className="card-type">{getCardType()}</span>
                  </div>
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Cardholder Name *</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardDetails.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={errors.cardholderName ? 'error' : ''}
                  />
                  {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Month *</label>
                    <input
                      type="text"
                      name="expiryMonth"
                      value={cardDetails.expiryMonth}
                      onChange={handleInputChange}
                      placeholder="MM"
                      className={errors.expiryMonth ? 'error' : ''}
                    />
                    {errors.expiryMonth && <span className="error-message">{errors.expiryMonth}</span>}
                  </div>
                  <div className="form-group">
                    <label>Expiry Year *</label>
                    <input
                      type="text"
                      name="expiryYear"
                      value={cardDetails.expiryYear}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                      className={errors.expiryYear ? 'error' : ''}
                    />
                    {errors.expiryYear && <span className="error-message">{errors.expiryYear}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={errors.cvv ? 'error' : ''}
                      maxLength="4"
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Billing Address</h2>
                
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={cardDetails.billingAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className={errors.billingAddress ? 'error' : ''}
                  />
                  {errors.billingAddress && <span className="error-message">{errors.billingAddress}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="billingCity"
                      value={cardDetails.billingCity}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className={errors.billingCity ? 'error' : ''}
                    />
                    {errors.billingCity && <span className="error-message">{errors.billingCity}</span>}
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="billingZip"
                      value={cardDetails.billingZip}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className={errors.billingZip ? 'error' : ''}
                    />
                    {errors.billingZip && <span className="error-message">{errors.billingZip}</span>}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="pay-now-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay $${total}`}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/order-summary')} 
                  className="back-btn"
                  disabled={isProcessing}
                >
                  Back to Order Summary
                </button>
              </div>

              <div className="security-note">
                <span className="lock-icon">🔒</span>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </form>
          </div>

          <div className="order-summary-sidebar">
            <h2>Order Summary</h2>
            <div className="sidebar-items">
              {cartItems.map((item) => (
                <div key={item._id} className="sidebar-item">
                  <img src={item.image} alt={item.name} />
                  <div className="sidebar-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="sidebar-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="sidebar-total">
              <div className="total-row">
                <span>Total Amount</span>
                <span className="total-amount">${total}</span>
              </div>
            </div>
            <div className="shipping-info">
              <h3>Shipping To:</h3>
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
              <p>Phone: {shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
