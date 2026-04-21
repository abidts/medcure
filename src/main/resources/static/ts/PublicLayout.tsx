import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from './AuthContext';
import AnnouncementBar from './AnnouncementBar';

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardHref, setDashboardHref] = useState('/login');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'DOCTOR') {
        setDashboardHref('/doctor/dashboard');
      } else if (user.role === 'STAFF') {
        setDashboardHref('/staff/dashboard');
      } else if (user.role === 'ADMIN') {
        setDashboardHref('/admin-panel');
      } else {
        const patientId = localStorage.getItem('patientId');
        setDashboardHref(`/patient/dashboard?patientId=${patientId}`);
      }
    } else {
      setDashboardHref('/login');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/doctors', label: 'Doctors' },
      { href: '/consultations', label: 'Consultations' },
      { href: '/tools', label: 'Tools' },
      { href: '/dictionary', label: 'Dictionary' },
      { href: '/about-us', label: 'About' },
    ],
    []
  );

  
  return (
    <div className="app-shell">
      <AnnouncementBar />

      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="site-brand" aria-label="Sehat24X7 home">
            <span className="site-brand-mark">S</span>
            <span>
              <strong>Sehat24X7</strong>
              <small>Trusted digital care</small>
            </span>
          </Link>

          <nav className="site-nav desktop-nav" aria-label="Primary">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={location.pathname === item.href ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-actions desktop-actions">
            {isAuthenticated ? (
              <>
                <Link to={dashboardHref} className="site-button site-button-secondary">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button type="button" className="site-button site-button-primary" onClick={logout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="site-button site-button-secondary">
                  Login
                </Link>
                <Link to="/doctor-register" className="site-button site-button-secondary">
                  Doctor Register
                </Link>
                <Link to="/patients/register" className="site-button site-button-primary">
                  Patient Register
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer-inner">
          <div>
            <p className="site-footer-title">Sehat24X7</p>
            <p className="site-footer-copy">Simple, secure and accessible care for every family.</p>
          </div>
          <div className="site-footer-links">
            <Link to="/about-us">About</Link>
            <Link to="/doctors">Find Doctors</Link>
            <Link to="/consultations">Consult Online</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
