import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/home">🏠 Home</Link></li>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
        <li><Link to="/my-courses">📚 My Courses</Link></li>
      </ul>
      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </nav>
  );
};

export default Navbar;
