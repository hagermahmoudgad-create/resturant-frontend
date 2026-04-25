import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import styles from './Footer.module.css';
import { CartProvider } from '../context/CartContext';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        
        
        <div>
          <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
            <Utensils size={28} />
            <span>Savoria</span>
          </Link>
          <p className={styles.brandDesc}>
            Experience the finest culinary creations in an ambiance of pure elegance. 
            We bring passion, quality, and art to every dish.
          </p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon} aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter"><Twitter size={20} /></a>
          </div>
        </div>

        
        <div>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li><Link to="/" className={styles.footerLink}>Home</Link></li>
            <li><Link to="/about" className={styles.footerLink}>About Us</Link></li>
            <li><Link to="/menu" className={styles.footerLink}>Our Menu</Link></li>
            <li><Link to="/book-table" className={styles.footerLink}>Book a Table</Link></li>
            <li><Link to="/order-online" className={styles.footerLink}>Order Online</Link></li>
          </ul>
        </div>

    
        <div>
          <h4 className={styles.footerHeading}>Contact Us</h4>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <MapPin size={20} className={styles.contactIcon} />
              <span>123 Culinary Avenue, Food District, NY 10001</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={20} className={styles.contactIcon} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={20} className={styles.contactIcon} />
              <span>reservations@savoria.com</span>
            </div>
          </div>
        </div>

     
        <div>
           <h4 className={styles.footerHeading}>Opening Hours</h4>
           <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span style={{ color: 'var(--primary-color)', minWidth: '90px' }}>Mon - Fri:</span>
                <span>11:00 AM - 10:00 PM</span>
              </div>
              <div className={styles.contactItem}>
                <span style={{ color: 'var(--primary-color)', minWidth: '90px' }}>Saturday:</span>
                <span>10:00 AM - 11:30 PM</span>
              </div>
              <div className={styles.contactItem}>
                <span style={{ color: 'var(--primary-color)', minWidth: '90px' }}>Sunday:</span>
                <span>10:00 AM - 09:00 PM</span>
              </div>
           </div>
        </div>

      </div>

      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Savoria Restaurant. All rights reserved.</p>
        <div>
            <Link to="#" className={styles.footerLink} style={{marginRight: '1rem', fontSize: '0.85rem'}}>Privacy Policy</Link>
            <Link to="#" className={styles.footerLink} style={{fontSize: '0.85rem'}}>Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
