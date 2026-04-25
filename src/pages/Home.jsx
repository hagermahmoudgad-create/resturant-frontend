import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Clock, Utensils, ArrowRight, Plus } from 'lucide-react';
import styles from './Home.module.css';
import api from '../api/api';

const Home = () => {
  const navigate = useNavigate();
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await api.get('/menu');
        if (response.data && response.data.length > 0) {
          setPopularDishes(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDishes();
  }, []);

  const getImage = (img) => {
    if (img && img.startsWith('http')) return img;
    return 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=880&auto=format&fit=crop';
  };

  return (
    <div className={styles.homeContainer}>
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Elevating Gastronomy</div>
          <h1 className={styles.heroTitle}>
            Experience
            <span>True Culinary</span>
            Excellence.
          </h1>
          <p className={styles.heroSubtitle}>
            Indulge your senses in a symphony of flavors crafted by masterpiece chefs using the finest seasonal ingredients.
          </p>
          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => navigate('/book-table')}>
              Reserve a Table
            </button>
            <button className="btn-secondary" onClick={() => navigate('/menu')}>
              View Menu
            </button>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <ChefHat size={32} />
          </div>
          <h3 className={styles.featureTitle}>Master Chefs</h3>
          <p className={styles.featureText}>
            Our kitchen is led by award-winning chefs who bring decades of culinary expertise to every plate.
          </p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Utensils size={32} />
          </div>
          <h3 className={styles.featureTitle}>Premium Quality</h3>
          <p className={styles.featureText}>
            We source only the freshest, highest-quality local ingredients for our seasonal menu.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.iconWrapper}>
            <Clock size={32} />
          </div>
          <h3 className={styles.featureTitle}>Fast Delivery</h3>
          <p className={styles.featureText}>
            Enjoy our gourmet meals in the comfort of your home with our exclusive fast delivery service.
          </p>
        </div>
      </section>

      
      <section className={styles.popularDishes}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionSubtitle}>Chef's Selection</p>
          <h2 className={styles.sectionTitle}>Signature Dishes</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'white' }}>Loading popular dishes...</div>
        ) : popularDishes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'white' }}>No dishes currently available. Check out our full menu!</div>
        ) : (
          <div className={styles.dishesGrid}>
            {popularDishes.map((dish) => (
              <div key={dish.id} className={styles.dishCard}>
                <div className={styles.dishImageWrapper}>
                  <img src={getImage(dish.image)} alt={dish.name} className={styles.dishImage} />
                  <span className={styles.dishPrice}>${dish.price}</span>
                </div>
                <div className={styles.dishInfo}>
                  <p className={styles.dishCategory}>{dish.category}</p>
                  <h3 className={styles.dishName}>{dish.name}</h3>
                  <p className={styles.dishDesc}>{dish.description}</p>
                  <button className={styles.addBtn} onClick={() => navigate('/order-online')}>
                    <Plus size={20} /> Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => navigate('/menu')}>
            Explore Full Menu <ArrowRight size={20} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Home;
