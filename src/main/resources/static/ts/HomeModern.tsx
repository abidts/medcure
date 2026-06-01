import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/design-system.css';
import '../css/home-modern.css';

interface SpecializationCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
  fee: number;
  doctors: number;
}

const HomeModern: React.FC = () => {
  const [specializations, setSpecializations] = useState<SpecializationCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await fetch('/api/specializations');
      if (response.ok) {
        const data = await response.json();
        setSpecializations(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <h1>Your Health, Our Priority</h1>
          <p className="hero-subtitle">Connect with qualified doctors, book consultations, and get expert medical advice</p>
          <Link to="/consultations" className="btn btn-primary btn-lg">
            Start Consultation
          </Link>
        </div>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header animate-slide-in">
            <h2>Why Choose Sehat24x7?</h2>
            <p>Professional healthcare at your fingertips</p>
          </div>

          <div className="features-grid">
            <div className="feature-card animate-fade-in">
              <div className="feature-icon">🩺</div>
              <h3>Expert Doctors</h3>
              <p>Qualified and experienced medical professionals ready to help</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">⏱️</div>
              <h3>Quick Consultations</h3>
              <p>Book and connect within minutes from the comfort of your home</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your medical information is completely secure and confidential</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">💳</div>
              <h3>Affordable Rates</h3>
              <p>Transparent pricing with no hidden charges</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">📋</div>
              <h3>Prescriptions</h3>
              <p>Get digital prescriptions directly from your doctor</p>
            </div>

            <div className="feature-card animate-fade-in">
              <div className="feature-icon">🎯</div>
              <h3>24/7 Available</h3>
              <p>Book consultations anytime, day or night</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="specializations-section">
        <div className="container">
          <div className="section-header animate-slide-in">
            <h2>Popular Specializations</h2>
            <p>Book consultations with specialists</p>
          </div>

          {loading ? (
            <div className="flex-center" style={{ height: '300px' }}>
              <div className="animate-pulse">Loading specializations...</div>
            </div>
          ) : (
            <div className="specializations-grid">
              {specializations.map((spec) => (
                <Link
                  key={spec.id}
                  to={`/consultation/book/${spec.id}`}
                  className="specialization-card-link"
                >
                  <div className="specialization-card animate-fade-in">
                    <div className="spec-icon-large">🏥</div>
                    <h3>{spec.name}</h3>
                    <p>{spec.description}</p>
                    <div className="spec-info">
                      <div className="spec-fee">₹{spec.fee || 499}</div>
                      <button className="btn btn-sm btn-primary">Book Now</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content animate-fade-in">
            <h2>Ready to Book Your First Consultation?</h2>
            <p>Join thousands of patients getting expert medical advice online</p>
            <div className="cta-buttons">
              <Link to="/consultations" className="btn btn-primary btn-lg">
                Explore Specializations
              </Link>
              <Link to="/about-us" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeModern;
