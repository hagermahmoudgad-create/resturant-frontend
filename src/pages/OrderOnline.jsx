import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './OrderOnline.module.css';
import api from '../api/api';

const OrderOnline = () => {
  const navigate = useNavigate();
  const { cartItems: cart, updateQuantity, removeFromCart: removeItem, clearCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

 
  const [formData, setFormData] = useState({
    delivery_address: '',
    phone: '',
    payment_method: 'Cash on Delivery',
    notes: ''
  });

  useEffect(() => {
   
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    
    const formattedItems = cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price
    }));

    const orderPayload = {
        ...formData,
        items: formattedItems
    };

    try {
        await api.post('/orders', orderPayload);
        setSuccess(true);
        clearCart(); 
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  if (success) {
      return (
          <div className={styles.checkoutContainer} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div className={`${styles.glassCard} ${styles.successMsg}`}>
                  <CheckCircle size={60} color="var(--success)" />
                  <h2>Order Placed Successfully!</h2>
                  <p>Your delicious food is being prepared and will be sent to <strong>{formData.delivery_address}</strong></p>
                  <button className="btn-primary" onClick={() => navigate('/profile')} style={{marginTop: '1rem'}}>
                      Track Order in Profile
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className={styles.checkoutContainer}>
      
     
      <div className={styles.cartSection}>
        <h1 className={styles.sectionTitle}><ShoppingCart size={28} /> Your Cart</h1>
        
        <div className={styles.glassCard}>
            {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                    <ShoppingCart size={48} style={{opacity: 0.5, marginBottom: '1rem'}} />
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any dishes yet.</p>
                    <button className="btn-secondary" style={{marginTop: '1.5rem'}} onClick={() => navigate('/menu')}>
                        Browse Menu
                    </button>
                </div>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className={styles.itemImage} />
                            
                            <div className={styles.itemInfo}>
                                <div className={styles.itemName}>{item.name}</div>
                                <div className={styles.itemPrice}>${item.price}</div>
                            </div>

                            <div className={styles.quantityControl}>
                                <button type="button" className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                                <span>{item.quantity}</span>
                                <button type="button" className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                            </div>

                            <button className={styles.deleteBtn} onClick={() => removeItem(item.id)} title="Remove item">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    
                    <div className={styles.cartTotal}>
                        <span>Total:</span>
                        <span className={styles.totalAmount}>${parseFloat(cartTotal).toFixed(2)}</span>
                    </div>
                </>
            )}
        </div>
      </div>

      <div className={styles.checkoutSection}>
          <h1 className={styles.sectionTitle}><CreditCard size={28} /> Checkout</h1>
          
          <div className={styles.glassCard}>
              {error && <div className={styles.errorMsg}>{error}</div>}
              
              <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                      <label>Delivery Address</label>
                      <input 
                          type="text" 
                          name="delivery_address" 
                          required 
                          placeholder="e.g. 123 Main St, Appt 4B" 
                          className={styles.formInput} 
                          value={formData.delivery_address}
                          onChange={handleChange}
                          disabled={cart.length === 0}
                      />
                  </div>

                  <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input 
                          type="tel" 
                          name="phone" 
                          required 
                          placeholder="For delivery driver contact" 
                          className={styles.formInput} 
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={cart.length === 0}
                      />
                  </div>

                  <div className={styles.formGroup}>
                      <label>Payment Method</label>
                      <select 
                          name="payment_method" 
                          className={styles.formInput} 
                          value={formData.payment_method}
                          onChange={handleChange}
                          disabled={cart.length === 0}
                      >
                          <option value="Cash on Delivery">Cash on Delivery</option>
                          <option value="Credit Card (POS)">Credit Card (POS on delivery)</option>
                      </select>
                  </div>

                  <div className={styles.formGroup}>
                      <label>Order Notes (Optional)</label>
                      <textarea 
                          name="notes" 
                          rows="3" 
                          placeholder="Any special instructions for the kitchen?" 
                          className={styles.formInput} 
                          value={formData.notes}
                          onChange={handleChange}
                          disabled={cart.length === 0}
                      ></textarea>
                  </div>

                  <button 
                      type="submit" 
                      className={`btn-primary ${styles.submitBtn}`} 
                      disabled={cart.length === 0 || loading}
                  >
                      {loading ? 'Processing Order...' : `Place Order ($${parseFloat(cartTotal).toFixed(2)})`}
                  </button>
              </form>
          </div>
      </div>

    </div>
  );
};

export default OrderOnline;
