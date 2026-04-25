import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './BookTable.module.css';
import api from '../api/api';

const BookTable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ date: '', time: '', guests: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/login'); 
      }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        await api.post('/bookings', formData);
        setSuccess(true);
        setFormData({ date: '', time: '', guests: '' }); 
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit booking. Please check your inputs.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <CalendarCheck size={36} />
          </div>
          <h1 className={styles.title}>Reserve Your Table</h1>
          <p className={styles.subtitle}>
            Secure your spot for an unforgettable dining experience. We look forward to hosting you.
          </p>
        </div>

        {success && (
            <div className={styles.successMsg}>
                Your booking request has been submitted successfully! The admin will review it shortly. You can check the status in your Profile.
            </div>
        )}

        {error && (
            <div className={styles.errorMsg}>
                {error}
            </div>
        )}

        <form className={styles.formGrid} onSubmit={handleSubmit}>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
             <label>Date of Reservation</label>
             <Calendar className={styles.inputIcon} size={20} />
             <input type="date" name="date" required className={styles.inputField} value={formData.date} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} 
             />
          </div>

          <div className={styles.formGroup}>
             <label>Time</label>
             <Clock className={styles.inputIcon} size={20} />
             <input 
                type="time"  name="time" required className={styles.inputField} value={formData.time} onChange={handleChange}
             />
          </div>

          <div className={styles.formGroup}>
             <label>Number of Guests</label>
             <Users className={styles.inputIcon} size={20} />
             <input 
                type="number"  name="guests" required min="1" max="20"
                className={styles.inputField} placeholder="Ex: 2" value={formData.guests} onChange={handleChange}
             />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Submitting Reservation...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTable;
