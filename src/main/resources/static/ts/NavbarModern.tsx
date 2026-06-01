import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/design-system.css';
import '../css/navbar-modern.css';

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: string;
}

const NavbarModern: React.FC<NavbarProps> = ({ isAuthenticated = false, userRole = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar-modern">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚕️</span>
          <span className="logo-text">Sehat24x7</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/consultations" className="nav-link">Consultations</Link>
            <Link to="/doctors" className="nav-link">Doctors</Link>
            <Link to="/about-us" className="nav-link">About</Link>
          </div>

          {/* Auth Buttons */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${userRole.toLowerCase()}/dashboard`}
                  className="btn btn-sm btn-outline"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline">
                  Login
                </Link>
                <Link to="/patients/register" className="btn btn-sm btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarModern;
