import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Utensils, ShoppingBag, Menu as MenuIcon, User, LogOut, Bell, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';
import api from '../api/api';
const Navbar = () => {
  const navigate = useNavigate();
  const [authData, setAuthData] = React.useState({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isLoggedIn: !!localStorage.getItem('token')
  });
  
  const { user, isLoggedIn } = authData;
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  React.useEffect(() => {
    const handleAuthChange = () => {
      setAuthData({
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        isLoggedIn: !!localStorage.getItem('token')
      });
    };

    window.addEventListener('authStatusChanged', handleAuthChange);
    return () => window.removeEventListener('authStatusChanged', handleAuthChange);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const { cartCount: cartItemsCount } = useCart();
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // pull every 15s
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    if (unread.length > 0) {
      try {
        await api.post('/notifications/mark-read');
        setNotifications(notifications.map(n => ({...n, is_read: true})));
      } catch (err) {
        console.error(err);
      }
    }
  };


  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.log('Logout failed on backend context');
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('authStatusChanged'));
      navigate('/');
    }
  };

  const getLinkClass = ({ isActive }) => {
    return isActive ? `${styles.link} ${styles.activeLink}` : styles.link;
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <Utensils className={styles.brandIcon} />
        Savoria
      </Link>

      <ul className={styles.navLinks}>
        <li><NavLink to="/" className={getLinkClass}>Home</NavLink></li>
        <li><NavLink to="/menu" className={getLinkClass}>Our Menu</NavLink></li>
        <li><NavLink to="/about" className={getLinkClass}>About Us</NavLink></li>
        {isLoggedIn && (
          <li><NavLink to="/book-table" className={getLinkClass}>Book Table</NavLink></li>
        )}
      </ul>

      <div className={styles.actions}>
        <button 
          className={styles.bellIcon} 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {isLoggedIn && (
          <Link to="/order-online" className={styles.cartIcon}>
            <ShoppingBag size={24} />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </Link>
        )}

        {isLoggedIn ? (
          <>
            {user?.role === 'admin' && (
               <button className="btn-secondary" onClick={() => navigate('/admin')}>Admin Panel</button>
            )}
            
            <div className={styles.notificationWrapper} onMouseEnter={markAsRead}>
              <button className={styles.bellIcon} title="Notifications">
                <Bell size={22} />
                {notifications.filter(n => !n.is_read).length > 0 && (
                   <span className={styles.bellBadge}>{notifications.filter(n => !n.is_read).length}</span>
                )}
              </button>
              <div className={styles.notificationDropdown}>
                <h4>Notifications</h4>
                <ul>
                  {notifications.length === 0 ? (
                      <li style={{fontStyle: 'italic', opacity: 0.7}}>No new notifications</li>
                  ) : (
                      notifications.slice(0, 5).map(note => (
                          <li key={note.id} style={{ opacity: note.is_read ? 0.7 : 1, fontWeight: note.is_read ? 'normal' : 'bold' }}>
                              {note.message}
                          </li>
                      ))
                  )}
                </ul>
              </div>
            </div>
            <button className="btn-primary" onClick={() => navigate('/profile')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={18} /> {user?.name?.split(' ')[0] || 'Profile'}
              </span>
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                <LogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-primary" onClick={() => navigate('/register')}>Register</button>
          </>
        )}

        <button className={styles.mobileMenuBtn}>
          <MenuIcon size={28} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
