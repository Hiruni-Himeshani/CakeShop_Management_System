import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./LoginModern.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (response.data.success) {
        login(response.data.user, response.data.accessToken);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-left" style={{ backgroundImage: "linear-gradient(180deg, rgba(22,163,74,.6), rgba(22,163,74,.6)), url('/images/cake-auth.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="brand">Bake.lk</div>
          <div className="welcome">Welcome Back!</div>
          <p className="lead">Sign in to access your account and continue your sweet journey with our delicious cakes and pastries.</p>
          <div className="perks">
            <div className="perk"><span className="dot">✓</span> Exclusive member discounts</div>
            <div className="perk"><span className="dot">✓</span> Track your orders</div>
            <div className="perk"><span className="dot">✓</span> Save your favorite items</div>
          </div>
        </div>
        <div className="auth-right">
          <h2 className="auth-title">Sign In</h2>
          <p className="auth-sub">Enter your credentials to access your account</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input className="input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input className="input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" />
            </div>
            <div className="actions">
              <label className="remember"><input type="checkbox" /> Remember me</label>
              <span className="link">Forgot Password?</span>
            </div>
            <button type="submit" className="cta" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</button>
            <hr className="alt" />
          </form>
          <div className="login-footer">
            <p>Don't have an account? <span className="link" onClick={() => navigate('/register')}>Sign Up</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
