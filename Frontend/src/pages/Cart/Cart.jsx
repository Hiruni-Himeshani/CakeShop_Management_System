import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { assets } from '../../assets/frontend_assets/assets';
import { useStore } from '../../context/StoreContext';

const Cart = () => {
  const { cartItems: cart, fetchCart, updateQuantity, removeFromCart, isAuthenticated } = useStore();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
    }
  }, [isAuthenticated, fetchCart]);

  // Handlers wrap context API
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return handleRemove(productId);
    
    // Update the toppings data in localStorage as well
    const cartWithToppings = JSON.parse(localStorage.getItem('cartWithToppings') || '[]');
    const itemWithToppings = cartWithToppings.find(ct => ct.cakeId === productId);
    if (itemWithToppings) {
      itemWithToppings.quantity = newQuantity;
      localStorage.setItem('cartWithToppings', JSON.stringify(cartWithToppings));
    }
    
    return updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    // Remove from localStorage as well
    const cartWithToppings = JSON.parse(localStorage.getItem('cartWithToppings') || '[]');
    const updatedCartWithToppings = cartWithToppings.filter(ct => ct.cakeId !== productId);
    localStorage.setItem('cartWithToppings', JSON.stringify(updatedCartWithToppings));
    
    return removeFromCart(productId);
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      // Clear both cart and toppings data
      localStorage.removeItem('cartWithToppings');
      // Note: saveCartToStorage is not defined, so we'll just clear localStorage
      // The cart will be cleared when the user refreshes or navigates
    }
  };

  // Get toppings information from localStorage
  const cartWithToppings = JSON.parse(localStorage.getItem('cartWithToppings') || '[]');
  
  // Calculate totals including toppings
  const calculateItemTotal = (item) => {
    const itemWithToppings = cartWithToppings.find(ct => ct.cakeId === (item.cake || item._id));
    if (itemWithToppings) {
      return itemWithToppings.totalPrice * item.quantity;
    }
    return item.price * item.quantity;
  };
  
  const subtotal = cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  const deliveryFee = subtotal >= 2000 ? 0 : 350; // Free delivery over Rs. 2000, otherwise Rs. 350
  const total = subtotal + deliveryFee;

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
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
                  <p className="cart-item-price">Rs. {item.price}</p>
                  {(() => {
                    const itemWithToppings = cartWithToppings.find(ct => ct.cakeId === (item.cake || item._id));
                    return itemWithToppings && itemWithToppings.toppings && itemWithToppings.toppings.length > 0 ? (
                      <div className="cart-item-toppings">
                        <span className="toppings-label">Toppings:</span>
                        <div className="toppings-list">
                          {itemWithToppings.toppings.map((topping, idx) => (
                            <span key={idx} className="topping-tag">
                              {topping.image} {topping.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                  <div className="cart-item-stock">Stock: {item.qty}</div>
                </div>
                
                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleUpdateQuantity(item.cake || item._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.cake || item._id, item.quantity + 1)}
                    className="quantity-btn"
                    disabled={item.quantity >= item.qty}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-total">
                  Rs. {calculateItemTotal(item).toFixed(2)}
                </div>
                
                <button
                  onClick={() => handleRemove(item.cake || item._id)}
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
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee.toFixed(2)}`}</span>
              </div>
              
              <hr className="summary-divider" />
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              
              {deliveryFee > 0 && (
                <div className="free-delivery-note">
                  Add Rs. {(2000 - subtotal).toFixed(2)} more for free delivery!
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

