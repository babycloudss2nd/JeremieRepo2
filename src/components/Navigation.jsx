import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUserName(storedUser.name || storedUser.email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h3>BlackShield⚔️</h3>
      </div>

      <div className="nav-links">
        <Link
          to="/home"
          className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}
        >
          Products
        </Link>
        <Link
          to="/cart"
          className={`nav-link ${location.pathname === "/cart" ? "active" : ""}`}
        >
          Cart
        </Link>
        <Link
          to="/booking"
          className={`nav-link ${location.pathname === "/booking" ? "active" : ""}`}
        >
          Appointments
        </Link>
      </div>

      <div className="nav-user">
        {userName ? (
          <>
            <span className="user-name">{userName}</span>
            <Link to="/login" className="logout-link" onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
