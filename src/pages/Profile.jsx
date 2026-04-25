import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, CalendarCheck, ShoppingBag, Shield, Edit2, X, Save } from 'lucide-react';
import styles from './Profile.module.css';
import api from '../api/api';

const Profile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
   
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', password: '' });
    const [updateError, setUpdateError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
               
                const userRes = await api.get('/user');
                setUser(userRes.data);

              
                const bookingsRes = await api.get('/bookings');
                setBookings(bookingsRes.data);

                
                const ordersRes = await api.get('/orders');
                setOrders(ordersRes.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.dispatchEvent(new Event('authStatusChanged'));
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (!token) {
            navigate('/login');
        } else {
            fetchProfileData();
        }
    }, [navigate, token]);

    const handleEditClick = () => {
        setEditForm({ name: user.name, phone: user.phone || '', password: '' });
        setUpdateError('');
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleFormChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            setUpdateError('');
            const res = await api.put(`/user/${user.id}`, editForm);
            setUser(res.data.user);
         
            if (localStorage.getItem('user')) {
                const updatedObj = { ...JSON.parse(localStorage.getItem('user')), ...res.data.user };
                localStorage.setItem('user', JSON.stringify(updatedObj));
                window.dispatchEvent(new Event('authStatusChanged'));
            }
            setIsEditing(false);
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'pending') return styles.statusPending;
        if (s === 'accepted' || s === 'delivered') return styles.statusAccepted;
        if (s === 'rejected') return styles.statusRejected;
        if (s === 'in progress') return styles.statusInProgress;
        return styles.statusPending;
    };

    if (loading) {
        return <div className={styles.loadingMsg}>Loading your profile...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            {user && (
                <div className={styles.profileCard}>
                    <div className={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {isEditing ? (
                        <form className={styles.editForm} onSubmit={handleUpdateProfile}>
                            <h2>Edit Profile</h2>
                            {updateError && <div className={styles.errorMsg}>{updateError}</div>}
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input  className={styles.inputField} type="text" name="name" value={editForm.name} onChange={handleFormChange} required  />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone</label>
                                <input className={styles.inputField} type="text" name="phone"  value={editForm.phone}  onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>New Password (Optional)</label>
                                <input className={styles.inputField} type="password" name="password" value={editForm.password}  onChange={handleFormChange} 
                                    placeholder="Leave blank to keep current" />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.saveBtn} disabled={isUpdating}>
                                    <Save size={18} /> {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className={styles.cancelBtn} onClick={handleCancelEdit} disabled={isUpdating}>
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.userInfo}>
                            <h1>{user.name}</h1>
                            <p><Mail size={18} className={styles.icon}/> {user.email}</p>
                            <p><Phone size={18} className={styles.icon}/> {user.phone || 'No phone provided'}</p>
                            {user.role === 'admin' && (
                                <p style={{color: 'var(--success)', marginTop: '0.5rem'}}>
                                    <Shield size={18}/> Administrator Account
                                </p>
                            )}
                            <button className={styles.editBtn} onClick={handleEditClick}>
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.grid}>
               
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <CalendarCheck size={24} /> My Table Bookings
                    </h2>
                    
                    {bookings.length === 0 ? (
                        <div className={styles.emptyState}>You have no table reservations yet.</div>
                    ) : (
                        <div className={styles.itemList}>
                            {bookings.map(booking => (
                                <div key={booking.id} className={styles.itemCard}>
                                    <div>
                                        <div className={styles.itemHeader}>Table for {booking.guests} Guests</div>
                                        <div className={styles.itemMeta}>
                                            <span>Date: {booking.date}</span>
                                            <span>Time: {booking.time}</span>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${getStatusStyle(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

               
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <ShoppingBag size={24} /> My Online Orders
                    </h2>
                    
                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>You haven't placed any online orders yet.</div>
                    ) : (
                        <div className={styles.itemList}>
                            {orders.map(order => (
                                <div key={order.id} className={styles.itemCard}>
                                    <div>
                                        <div className={styles.itemHeader}>Order #{order.id}</div>
                                        <div className={styles.itemMeta}>
                                            <span>Amount: ${order.total_amount}</span>
                                            <span>Items: {order.items?.length || 0}</span>
                                            <span style={{opacity: 0.7, fontSize: '0.8rem'}}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
