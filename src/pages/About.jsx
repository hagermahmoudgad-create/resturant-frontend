import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      
      <div className={styles.heroSection}>
        <h1 className={styles.title}>The Art of Fine Dining</h1>
        <p className={styles.subtitle}>A legacy of taste, crafted with passion.</p>
        <p className={styles.description}>
          Welcome to Savoria, where culinary excellence meets unparalleled ambiance. 
          Founded with a vision to redefine gastronomy, we believe in serving not just meals, 
          but unforgettable memories. Our journey began with a simple philosophy: use the finest 
          ingredients, treat them with respect, and serve them with love.
        </p>
      </div>

      <div className={styles.storyGrid}>
        <div className={styles.imageWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1170&auto=format&fit=crop" 
            alt="Chef preparing food" 
          />
          <div className={styles.borderFrame}></div>
        </div>
        
        <div className={styles.storyContent}>
          <h2>Our Philosophy</h2>
          <p>
            At the heart of our kitchen is a commitment to sustainable sourcing and seasonal menus. 
            Our master chefs work closely with local farmers to bring the freshest produce directly to your plate.
          </p>
          <p>
            Every dish is a testament to our dedication to flavor. We blend traditional cooking techniques 
            with modern innovation to create bold, inspiring, and beautiful culinary masterpieces.
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>15+</div>
          <div className={styles.statLabel}>Years of Excellence</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>50k</div>
          <div className={styles.statLabel}>Happy Guests</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>12</div>
          <div className={styles.statLabel}>Culinary Awards</div>
        </div>
      </div>

    </div>
  );
};

export default About;
