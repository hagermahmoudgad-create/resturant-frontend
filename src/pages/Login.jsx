import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn } from 'lucide-react';
import styles from './Auth.module.css';
import api from '../api/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Sending request to Laravel Backend
      const response = await api.post('/login', formData);
      // Save Token directly to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authStatusChanged'));
      
      // Navigate to Home or Admin Panel based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      } 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authIconWrapper}>
            <LogIn size={30} />
          </div>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Sign in to access your Savoria account</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              name="email"
              className={styles.inputField}
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              name="password"
              className={styles.inputField}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.switchAuth}>
          Don't have an account? 
          <Link to="/register" className={styles.authLink}>Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
