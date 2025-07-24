import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";   // ← pull in auth state
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInstructor , isStudent } = useAuth();

  // Hide the entire nav if not logged in
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/home", { replace: true });
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/home">🏠 Home</Link></li>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
        <li>
          <Link to="/my-courses">
            {isInstructor ? "👩‍🏫 My Teaching" : "📚 My Courses"}
          </Link>
        </li>
        {isInstructor && (
          <li>
            <Link to="/create-course">➕ Create Course</Link>
          </li>
        )}
        {isStudent && (
          <li>
            <Link to="/available">➕Enroll New</Link>
          </li>
        )}
      </ul>
      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </nav>
  );
};

export default Navbar;
