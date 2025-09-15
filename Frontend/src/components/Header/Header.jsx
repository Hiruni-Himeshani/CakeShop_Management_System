import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { assets } from "../../assets/frontend_assets/assets";

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Load cart count from localStorage
    const loadCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    };

    loadCartCount();

    // Listen for storage changes (when cart is updated in other tabs)
    window.addEventListener('storage', loadCartCount);
    
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', loadCartCount);

    return () => {
      window.removeEventListener('storage', loadCartCount);
      window.removeEventListener('cartUpdated', loadCartCount);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="header">
      <div className="header-contents">
        <div className="header-logo">
          <Link to="/products" onClick={scrollToTop}>
            <img src={assets.logo} alt="Fresh Bake Logo" className="header-logo-img" />
          </Link>
        </div>
        
        <div className="header-nav">
          <Link to="/products" onClick={scrollToTop} className="nav-link">
            Products
          </Link>
          <Link to="/cart" onClick={scrollToTop} className="nav-link cart-link">
            <img src={assets.basket_icon} alt="Cart" className="cart-icon" />
            Cart
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
