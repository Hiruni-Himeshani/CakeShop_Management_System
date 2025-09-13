// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to admin panel on component mount
    navigate("/admin");
  }, [navigate]);

  return (
    <div className="home">
      <div className="loading-message">
        <h2>Redirecting to Admin Panel...</h2>
      </div>
    </div>
  );
};

export default Home;
