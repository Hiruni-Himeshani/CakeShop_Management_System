import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { assets } from '../../assets/frontend_assets/assets';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Load cart from localStorage
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  // Save cart to localStorage
  const saveCartToStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  // Update cart quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    saveCartToStorage(updatedCart);
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    saveCartToStorage(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      saveCartToStorage([]);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Proceed to checkout (placeholder function)
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // For now, just show an alert
    alert('Checkout functionality will be implemented soon!');
    
    // In a real application, you would:
    // 1. Create an order
    // 2. Process payment
    // 3. Clear cart
    // 4. Redirect to order confirmation
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
          </div>
          
          <div className="empty-cart">
            <img src={assets.basket_icon} alt="Empty Cart" className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button 
              onClick={() => navigate('/products')} 
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.image ? `http://localhost:5000/uploads/${item.image}` : assets.menu_1}
                    alt={item.productName}
                  />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.productName}</h3>
                  <p className="cart-item-price">${item.price}</p>
                  <div className="cart-item-stock">Stock: {item.qty}</div>
                </div>
                
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                    className="quantity-btn"
                    disabled={item.quantity >= item.qty}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-item-btn"
                >
                  <img src={assets.remove_icon_red} alt="Remove" />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <hr className="summary-divider" />
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {shipping > 0 && (
                <div className="free-shipping-note">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <button
                onClick={proceedToCheckout}
                className="checkout-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="continue-shopping-btn"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
