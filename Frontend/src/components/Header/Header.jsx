import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { assets } from "../../assets/frontend_assets/assets";
import { useStore } from "../../context/StoreContext";

const Header = () => {
  const navigate = useNavigate();
  const { cartItems, isAuthenticated, logout } = useStore();
  const cartCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);

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
          {!isAuthenticated ? (
            <>
              <button className="auth-btn" onClick={() => navigate('/login')}>Login</button>
              <button className="auth-btn primary" onClick={() => navigate('/register')}>Register</button>
            </>
          ) : (
            <button className="auth-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
