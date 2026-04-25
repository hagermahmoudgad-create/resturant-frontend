import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, UserPlus, User } from 'lucide-react';
import styles from './Auth.module.css';
import api from '../api/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const response = await api.post('/register', formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authStatusChanged'));
      
      navigate('/'); 
    } catch (err) {

      const data = err.response?.data;
      if (data && data.errors) {
        
        const firstErrorKey = Object.keys(data.errors)[0];
        setError(data.errors[firstErrorKey][0]);
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authIconWrapper}>
            <UserPlus size={30} />
          </div>
          <h1 className={styles.authTitle}>Join Savoria</h1>
          <p className={styles.authSubtitle}>Create your account for exclusive bookings and fast ordering.</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <User className={styles.inputIcon} size={20} />
            <input
              type="text"
              name="name"
              className={styles.inputField}
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Password (Min. 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.switchAuth}>
          Already a member? 
          <Link to="/login" className={styles.authLink}>Sign In Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
