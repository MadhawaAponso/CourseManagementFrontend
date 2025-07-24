import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './style/HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h2>Welcome to CourseHub</h2>
            <p>Your complete course management solution for students and educators.</p>
            {!isAuthenticated && (
              <button
                className="cta-button"
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
            )}
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Students learning"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Course Management</h3>
              <p>
                Easily create, organize, and manage your courses with our
                intuitive interface. Add materials, assignments, and track
                student progress.
              </p>
            </div>
            <div className="feature-card">
              <h3>Student Portal</h3>
              <p>
                Students can access their courses, submit assignments, view
                grades, and communicate with instructors all in one place.
              </p>
            </div>
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>
                Monitor student performance with detailed analytics and
                reports. Identify areas where students need additional support.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about">
          <div className="about-content">
            <h2>About Our Platform</h2>
            <p>
              CourseHub is designed to streamline the educational process for
              both instructors and students. Our platform provides a
              comprehensive solution for course delivery, assignment
              management, grade tracking, and student communication.
            </p>
            <p>
              With over 10,000 active users and 500+ courses, we've helped
              educational institutions worldwide improve their teaching
              effectiveness and student engagement.
            </p>
          </div>
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Online learning"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Courses</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Institutions</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>CourseHub</h4>
            <p>Making education accessible and manageable for everyone.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@coursehub.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CourseHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
