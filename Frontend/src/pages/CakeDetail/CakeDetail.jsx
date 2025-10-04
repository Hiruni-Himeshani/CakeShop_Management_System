import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import './CakeDetail.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { assets } from '../../assets/frontend_assets/assets';

const CakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useStore();
  
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Simple test to see if component renders
  console.log('CakeDetail component rendering with ID:', id);

  // Available toppings with prices
  const availableToppings = [
    { id: 1, name: 'Chocolate Chips', price: 150, image: '🍫' },
    { id: 2, name: 'Fresh Strawberries', price: 200, image: '🍓' },
    { id: 3, name: 'Nuts (Almonds)', price: 180, image: '🥜' },
    { id: 4, name: 'Whipped Cream', price: 100, image: '🧁' },
    { id: 5, name: 'Caramel Drizzle', price: 120, image: '🍯' },
    { id: 6, name: 'Sprinkles', price: 80, image: '✨' },
    { id: 7, name: 'Coconut Flakes', price: 90, image: '🥥' },
    { id: 8, name: 'Edible Flowers', price: 250, image: '🌸' }
  ];

  useEffect(() => {
    fetchCakeDetails();
  }, [id]);

  useEffect(() => {
    if (cake) {
      const toppingsPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
      setTotalPrice((cake.price + toppingsPrice) * quantity);
    }
  }, [cake, selectedToppings, quantity]);

  const fetchCakeDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching cake with ID:', id);
      const response = await axios.get(`http://localhost:5000/api/cakes/${id}`);
      console.log('API Response:', response.data);
      if (response.data.success) {
        setCake(response.data.data);
        console.log('Cake set successfully:', response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch cake');
      }
    } catch (error) {
      console.error('Error fetching cake details:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load cake details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      const isSelected = prev.find(t => t.id === topping.id);
      if (isSelected) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= cake?.qty) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (cake.qty < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      // Store toppings information in localStorage for checkout
      const cartItemWithToppings = {
        cakeId: cake._id,
        quantity: quantity,
        toppings: selectedToppings,
        totalPrice: totalPrice,
        basePrice: cake.price,
        toppingsPrice: selectedToppings.reduce((total, topping) => total + topping.price, 0)
      };

      // Store in localStorage for checkout page to access
      const existingCartData = JSON.parse(localStorage.getItem('cartWithToppings') || '[]');
      const existingItemIndex = existingCartData.findIndex(item => item.cakeId === cake._id);
      
      if (existingItemIndex >= 0) {
        existingCartData[existingItemIndex] = cartItemWithToppings;
      } else {
        existingCartData.push(cartItemWithToppings);
      }
      
      localStorage.setItem('cartWithToppings', JSON.stringify(existingCartData));

      await addToCart(cake._id, quantity);
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      return;
    }

    if (cake.qty < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      // Store toppings information in localStorage for checkout
      const cartItemWithToppings = {
        cakeId: cake._id,
        quantity: quantity,
        toppings: selectedToppings,
        totalPrice: totalPrice,
        basePrice: cake.price,
        toppingsPrice: selectedToppings.reduce((total, topping) => total + topping.price, 0)
      };

      // Store in localStorage for checkout page to access
      const existingCartData = JSON.parse(localStorage.getItem('cartWithToppings') || '[]');
      const existingItemIndex = existingCartData.findIndex(item => item.cakeId === cake._id);
      
      if (existingItemIndex >= 0) {
        existingCartData[existingItemIndex] = cartItemWithToppings;
      } else {
        existingCartData.push(cartItemWithToppings);
      }
      
      localStorage.setItem('cartWithToppings', JSON.stringify(existingCartData));

      // Add to cart first
      await addToCart(cake._id, quantity);
      // Then navigate to checkout
      navigate('/checkout');
      toast.success('Added to cart and proceeding to checkout!');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  if (loading) {
    return (
      <div className="cake-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cake details for ID: {id}</p>
          <p>If this takes too long, there might be an issue with the API call.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="cake-detail-page">
        <Header />
        <div className="error-container">
          <h2>Cake not found</h2>
          <p>The cake you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/products')} className="back-btn">
            Back to Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isInStock = cake.qty > 0;
  const stockStatus = isInStock ? 'In Stock' : 'Out of Stock';
  const stockClass = isInStock ? 'in-stock' : 'out-of-stock';

  return (
    <div className="cake-detail-page">
      <Header />
      
      <div className="cake-detail-container">
        <div className="breadcrumb">
          <button onClick={() => navigate('/products')} className="breadcrumb-link">
            ← Back to Products
          </button>
        </div>

        <div className="cake-detail-content">
          <div className="cake-image-section">
            <div className="cake-image-container">
              <img
                src={cake.image ? `http://localhost:5000/uploads/${cake.image}` : assets.menu_1}
                alt={cake.productName}
                className="cake-image"
              />
              <div className={`stock-badge ${stockClass}`}>
                {stockStatus}
              </div>
              <div className="image-overlay">
                <button className="zoom-btn" onClick={() => window.open(cake.image ? `http://localhost:5000/uploads/${cake.image}` : assets.menu_1, '_blank')}>
                  🔍 Zoom
                </button>
              </div>
            </div>
          </div>

          <div className="cake-info-section">
            <div className="cake-header">
              <h1 className="cake-name">{cake.productName}</h1>
              <div className="cake-category">{cake.category}</div>
              <div className="cake-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">(4.8/5) - 127 reviews</span>
              </div>
            </div>

            <div className="cake-description">
              <h3>Description</h3>
              <p>{cake.description || 'Delicious homemade cake made with fresh ingredients and love. Perfect for any special occasion!'}</p>
            </div>

            <div className="materials-section">
              <h3>Ingredients & Materials</h3>
              <div className="materials-grid">
                <div className="material-item">
                  <span className="material-icon">🥛</span>
                  <span className="material-name">Fresh Milk</span>
                </div>
                <div className="material-item">
                  <span className="material-icon">🥚</span>
                  <span className="material-name">Farm Fresh Eggs</span>
                </div>
                <div className="material-item">
                  <span className="material-icon">🌾</span>
                  <span className="material-name">Premium Flour</span>
                </div>
                <div className="material-item">
                  <span className="material-icon">🧈</span>
                  <span className="material-name">Pure Butter</span>
                </div>
                <div className="material-item">
                  <span className="material-icon">🍯</span>
                  <span className="material-name">Natural Sugar</span>
                </div>
                <div className="material-item">
                  <span className="material-icon">🍫</span>
                  <span className="material-name">Quality Chocolate</span>
                </div>
              </div>
            </div>

            <div className="price-section">
              <div className="base-price">
                <span className="price-label">Base Price:</span>
                <span className="price-value">Rs. {cake.price.toLocaleString()}</span>
              </div>
              {selectedToppings.length > 0 && (
                <div className="toppings-price">
                  <span className="price-label">Selected Toppings:</span>
                  <span className="price-value">
                    Rs. {selectedToppings.reduce((total, topping) => total + topping.price, 0).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="total-price">
                <span className="price-label">Total Price:</span>
                <span className="price-value">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="quantity-section">
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= cake.qty}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="stock-info">
                <span className="stock-icon">📦</span>
                {cake.qty} available in stock
              </div>
            </div>

            <div className="toppings-section">
              <h3 className="toppings-title">Add Toppings (Optional)</h3>
              <p className="toppings-subtitle">Enhance your cake with these delicious toppings</p>
              <div className="toppings-grid">
                {availableToppings.map(topping => (
                  <div
                    key={topping.id}
                    className={`topping-card ${selectedToppings.find(t => t.id === topping.id) ? 'selected' : ''}`}
                    onClick={() => handleToppingToggle(topping)}
                  >
                    <div className="topping-emoji">{topping.image}</div>
                    <div className="topping-name">{topping.name}</div>
                    <div className="topping-price">Rs. {topping.price}</div>
                    {selectedToppings.find(t => t.id === topping.id) && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="cake-features">
              <h3>Why Choose This Cake?</h3>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">🌱</span>
                  <span>Made with organic ingredients</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏠</span>
                  <span>Baked fresh daily</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚚</span>
                  <span>Free delivery over Rs. 2000</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎂</span>
                  <span>Perfect for celebrations</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || !isAuthenticated}
                className="action-btn add-to-cart-btn"
              >
                <span className="btn-icon">🛒</span>
                Add to Cart
              </button>
              <button
                onClick={handleProceedToCheckout}
                disabled={!isInStock || !isAuthenticated}
                className="action-btn checkout-btn"
              >
                <span className="btn-icon">💳</span>
                Proceed to Checkout
              </button>
            </div>

            {!isAuthenticated && (
              <div className="auth-notice">
                <div className="auth-icon">🔒</div>
                <div className="auth-content">
                  <p>Please login to add items to cart or proceed to checkout.</p>
                  <button onClick={() => navigate('/login')} className="login-btn">
                    Login Now
                  </button>
                </div>
              </div>
            )}

            <div className="delivery-info">
              <h4>Delivery Information</h4>
              <div className="delivery-details">
                <div className="delivery-item">
                  <span className="delivery-icon">⏰</span>
                  <span>Estimated delivery: 2-3 business days</span>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon">🚚</span>
                  <span>Free delivery on orders over Rs. 2000</span>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon">📦</span>
                  <span>Carefully packaged for freshness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CakeDetail;
