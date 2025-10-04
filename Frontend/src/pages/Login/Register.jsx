import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useStore } from "../../context/StoreContext";
import "./LoginModern.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      if (res.data?.success || res.status === 201) {
        // Auto-login after register
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", { email: formData.email, password: formData.password });
        if (loginRes.data?.success) {
          login(loginRes.data.user, loginRes.data.accessToken);
          toast.success("Registered successfully!");
          navigate("/");
          return;
        }
      }
      toast.error(res.data?.message || "Registration failed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-left" style={{ backgroundImage: "linear-gradient(180deg, rgba(22,163,74,.6), rgba(22,163,74,.6)), url('/images/cake-auth.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="brand">Bake.lk</div>
          <div className="welcome">Join Bake.lk</div>
          <p className="lead">Create your account to unlock exclusive member discounts and track your sweet orders.</p>
          <div className="perks">
            <div className="perk"><span className="dot">✓</span> Members-only offers</div>
            <div className="perk"><span className="dot">✓</span> Order history</div>
            <div className="perk"><span className="dot">✓</span> Favorite your cakes</div>
          </div>
        </div>
        <div className="auth-right">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-sub">It only takes a minute</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input className="input" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input className="input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input className="input" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" />
            </div>
            <button type="submit" className="cta" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <div className="login-footer">
            <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


