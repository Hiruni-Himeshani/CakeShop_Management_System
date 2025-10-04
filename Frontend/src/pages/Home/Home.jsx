import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { assets } from "../../assets/frontend_assets/assets";
import axios from "axios";

const Home = () => {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCakes();
  }, []);

  const fetchFeaturedCakes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cakes');
      if (response.data.success) {
        // Get first 3 cakes as featured
        setFeaturedCakes(response.data.data.slice(0, 3));
      } else {
        throw new Error(response.data.message || 'Failed to fetch cakes');
      }
    } catch (error) {
      console.error('Error fetching featured cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <Header />
      
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to Fresh Bake</h1>
          <p>Indulge in our delicious, home-baked cakes made with the finest ingredients and complete cleanliness, delivered fresh to your door for every special occasion!</p>
          <div className="hero-buttons">
            <Link to="/products" className="hero-btn primary">
              View Our Cakes
            </Link>
            <Link to="/cart" className="hero-btn secondary">
              View Cart
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={assets.header_img} alt="Delicious Cakes" />
        </div>
      </div>

      <div className="home-features">
        <div className="features-container">
          <h2>Featured Cakes</h2>
          <div className="features-grid">
            {loading ? (
              <div className="loading-message">Loading featured cakes...</div>
            ) : featuredCakes.length > 0 ? (
              featuredCakes.map((cake) => (
                <Link key={cake._id} to={`/cake/${cake._id}`} className="feature-card clickable">
                  <img 
                    src={cake.image ? `http://localhost:5000/uploads/${cake.image}` : assets.menu_1} 
                    alt={cake.productName} 
                  />
                  <h3>{cake.productName}</h3>
                  <p>{cake.description || 'Delicious homemade cake made with fresh ingredients and love.'}</p>
                  <div className="cake-price">Rs. {cake.price.toLocaleString()}</div>
                  <div className={`stock-status ${cake.qty > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {cake.qty > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-cakes-message">No cakes available at the moment.</div>
            )}
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="features-container">
          <h2>Why Choose Fresh Bake?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <img src={assets.menu_1} alt="Fresh Ingredients" />
              <h3>Fresh Ingredients</h3>
              <p>We use only the finest, freshest ingredients in all our cakes</p>
            </div>
            <div className="feature-card">
              <img src={assets.menu_2} alt="Home Made" />
              <h3>Home Made</h3>
              <p>Every cake is carefully crafted in our kitchen with love</p>
            </div>
            <div className="feature-card">
              <img src={assets.menu_3} alt="Fast Delivery" />
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
