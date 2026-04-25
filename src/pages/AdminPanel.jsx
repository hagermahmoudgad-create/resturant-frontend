import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    
    
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '', image: '' });
    const [imageFile, setImageFile] = useState(null);
    const [isEditingMenu, setIsEditingMenu] = useState(false);
    const [editingMenuId, setEditingMenuId] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

       
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchData(activeTab);
    }, [activeTab, navigate]);

    const fetchData = async (tab) => {
        setLoading(true);
        try {
            if (tab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else if (tab === 'bookings') {
                const res = await api.get('/admin/bookings');
                setBookings(res.data);
            } else if (tab === 'orders') {
                const res = await api.get('/admin/orders');
                setOrders(res.data);
            } else if (tab === 'menu') {
                const res = await api.get('/menu');
                setMenuItems(res.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            if(error.response?.status === 403) {
                 navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBookingStatus = async (id, status) => {
        try {
            await api.put(`/admin/bookings/${id}`, { status });
            fetchData('bookings'); 
        } catch (error) {
            console.error('Failed to update booking status');
        }
    };

    
    const handleOrderStatus = async (id, status) => {
        try {
            await api.put(`/admin/orders/${id}`, { status });
            fetchData('orders'); 
        } catch (error) {
            console.error('Failed to update order status');
        }
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', menuForm.name);
            formData.append('description', menuForm.description);
            formData.append('price', menuForm.price);
            formData.append('category', menuForm.category);
            if (menuForm.image) formData.append('image', menuForm.image);
            if (imageFile) formData.append('image_file', imageFile);

            if (isEditingMenu) {
                formData.append('_method', 'PUT');
                await api.post(`/menu/${editingMenuId}`, formData);
            } else {
                await api.post('/menu', formData);
            }
            
            setMenuForm({ name: '', description: '', price: '', category: '', image: '' });
            setImageFile(null);
            setIsEditingMenu(false);
            setEditingMenuId(null);
            fetchData('menu');
        } catch (error) {
            console.error('Failed to save menu item', error.response?.data);
            alert(error.response?.data?.message || 'Failed to save menu item. Check image size or required fields.');
        }
    };

    const handleMenuDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/menu/${id}`);
                fetchData('menu');
            } catch (error) {
                console.error('Failed to delete menu item', error.response?.data);
                alert('Failed to delete menu item! It might be linked to orders.');
            }
        }
    };

    const handleMenuEdit = (item) => {
        setIsEditingMenu(true);
        setEditingMenuId(item.id);
        setImageFile(null);
        setMenuForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image || ''
        });
    };

    
    const getStatusStyle = (status) => {
        const s = status.toLowerCase();
        if (s === 'pending') return styles.statusPending;
        if (s === 'accepted' || s === 'delivered') return styles.statusSuccess;
        if (s === 'rejected') return styles.statusDanger;
        return styles.statusInfo; 
    };

    return (
        <div className={styles.adminContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
            </div>

            <div className={styles.tabs}>
                <button className={`${styles.tabBtn} ${activeTab === 'users' ? styles.activeTab : ''}`} onClick={() => setActiveTab('users')}>Users</button>
                <button className={`${styles.tabBtn} ${activeTab === 'bookings' ? styles.activeTab : ''}`} onClick={() => setActiveTab('bookings')}>Table Bookings</button>
                <button className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`} onClick={() => setActiveTab('orders')}>Online Orders</button>
                <button className={`${styles.tabBtn} ${activeTab === 'menu' ? styles.activeTab : ''}`} onClick={() => setActiveTab('menu')}>Menu Items</button>
            </div>

            <div className={styles.contentWrapper}>
                {loading ? (
                    <div className={styles.loading}>Loading Data...</div>
                ) : (
                    <>
                       
                        {activeTab === 'users' && (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td>#{u.id}</td>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>{u.phone || 'N/A'}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${u.role === 'admin' ? styles.statusSuccess : styles.statusInfo}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        
                        {activeTab === 'bookings' && (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Date & Time</th>
                                            <th>Guests</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(b => (
                                            <tr key={b.id}>
                                                <td>#{b.id}</td>
                                                <td>{b.user?.name}</td>
                                                <td>{b.date} at {b.time}</td>
                                                <td>{b.guests}</td>
                                                <td><span className={`${styles.statusBadge} ${getStatusStyle(b.status)}`}>{b.status}</span></td>
                                                <td>
                                                    {b.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleBookingStatus(b.id, 'accepted')} className={styles.smallBtn} style={{marginRight: '8px'}}>Accept</button>
                                                            <button onClick={() => handleBookingStatus(b.id, 'rejected')} className={`${styles.smallBtn} ${styles.danger}`}>Reject</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        
                        {activeTab === 'orders' && (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Payment</th>
                                            <th>Address</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id}>
                                                <td>#{o.id}</td>
                                                <td>{o.user?.name}<br/><small>{o.phone}</small></td>
                                                <td>{o.items?.length || 0} items</td>
                                                <td>${o.total_amount}</td>
                                                <td>{o.payment_method}</td>
                                                <td>{o.delivery_address}</td>
                                                <td><span className={`${styles.statusBadge} ${getStatusStyle(o.status)}`}>{o.status}</span></td>
                                                <td>
                                                    <select 
                                                        className={styles.actionSelect}
                                                        value={o.status}
                                                        onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Accepted">Accepted</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        
                        {activeTab === 'menu' && (
                            <div>
                                <form className={styles.formGrid} onSubmit={handleMenuSubmit}>
                                    <div className={styles.formGroup}>
                                        <label>Dish Name</label>
                                        <input type="text" className={styles.formInput} value={menuForm.name} onChange={e => setMenuForm({...menuForm, name: e.target.value})} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Category</label>
                                        <input type="text" className={styles.formInput} value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Price ($)</label>
                                        <input type="number" step="0.01" className={styles.formInput} value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Image URL (Optional)</label>
                                        <input type="text" className={styles.formInput} placeholder="https://..." value={menuForm.image} onChange={e => setMenuForm({...menuForm, image: e.target.value})} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Or Upload File 📸</label>
                                        <input type="file" accept="image/*" className={styles.formInput} onChange={e => setImageFile(e.target.files[0])} style={{padding: '6px'}} />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Description</label>
                                        <textarea className={styles.formInput} rows="3" value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})} required></textarea>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <button type="submit" className="btn-primary" style={{width: '200px'}}>
                                            {isEditingMenu ? 'Update Item' : 'Add New Item'}
                                        </button>
                                        {isEditingMenu && (
                                            <button type="button" className={`${styles.smallBtn} ${styles.danger}`} style={{marginLeft: '1rem'}} onClick={() => { setIsEditingMenu(false); setImageFile(null); setMenuForm({ name: '', description: '', price: '', category: '', image: '' }); }}>Cancel Edit</button>
                                        )}
                                    </div>
                                </form>

                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {menuItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} style={{width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover'}} />
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>{item.category}</td>
                                                    <td>${item.price}</td>
                                                    <td>
                                                        <button onClick={() => handleMenuEdit(item)} className={styles.smallBtn} style={{marginRight: '8px'}}>Edit</button>
                                                        <button onClick={() => handleMenuDelete(item.id)} className={`${styles.smallBtn} ${styles.danger}`}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
