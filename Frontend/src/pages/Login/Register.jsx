import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useStore } from "../../context/StoreContext";
import "./Login.css";

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
    <div className="login-container">
      <div className="login-card">
        <div className="auth-layout">
          <div className="auth-visual">
            <img src="/logo/logo1.png" alt="Create your account" />
          </div>
          <div className="auth-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" />
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>{isLoading ? "Creating..." : "Create Account"}</button>
        </form>
        <div className="login-footer">
          <p>
            Already have an account? <span className="link" onClick={() => navigate('/login')}>Login</span>
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


