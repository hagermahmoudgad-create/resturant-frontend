import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './OurMenu.module.css';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OurMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // In a real app, this should be global context
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await api.get('/menu');
            setMenuItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    const filteredMenu = selectedCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            image: getImage(item.image)
        });
        
     
        toast.success(`${item.name} added to your order!`, {
            onClick: () => navigate('/order-online')
        });
    };

    const getImage = (img) => {
        if (img && img.startsWith('http')) return img;
        return 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=880&auto=format&fit=crop';
    };

    return (
        <div className={styles.menuContainer}>
            <div className={styles.headerSection}>
                <h1>Our Culinary Offerings</h1>
                <p>A masterpiece in every bite</p>
            </div>

            <div className={styles.filtersWrapper}>
                <div className={styles.categories}>
                    {categories.map((cat, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedCategory(cat)}
                            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.activeCategory : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{textAlign: 'center', marginTop: '3rem', color: 'white'}}>Loading our delicious menu...</div>
            ) : (
                <div className={styles.grid}>
                    {filteredMenu.map(item => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.imageBox}>
                                <img src={getImage(item.image)} alt={item.name} className={styles.image} />
                                <span className={styles.price}>${item.price}</span>
                            </div>
                            <div className={styles.info}>
                                <h3>{item.name}</h3>
                                <p className={styles.desc}>{item.description}</p>
                                
                                {isLoggedIn ? (
                                    <button className={styles.addToCartBtn} onClick={() => handleAddToCart(item)}>
                                        <Plus size={18} /> Add to Order
                                    </button>
                                ) : (
                                    <button className={styles.loginToOrderBtn} onClick={() => navigate('/login')}>
                                        Login to Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OurMenu;
