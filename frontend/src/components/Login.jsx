import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import API_BASE_URL from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data && data.success) {
        setMessage({ type: 'success', text: data.message || 'Login successful!' });
        // Store user data including _id and redirect to home page
        login({ 
          _id: data._id,
          email: data.email,
          fullName: data.fullName || email,
          phone: data.phone
        });
        console.log('User logged in:', { _id: data._id, email: data.email, fullName: data.fullName });
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid credentials' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Could not reach server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <Logo />
        <h2>Sign in</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/signup" className="btn-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
