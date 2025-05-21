import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="bg-primary bg-gradient text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">{t('welcome')}</h1>
              <p className="lead fs-4 mb-4">{t('description')}</p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-light btn-lg">
                  Get Started
                </Link>
                <Link to="/report-problem" className="btn btn-outline-light btn-lg">
                  Report Issue
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5">How SmartEye Works</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-4 mx-auto" style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-camera-retro fa-2x"></i>
                </div>
                <h3 className="h4 mb-3">{t('reportProblem')}</h3>
                <p className="text-muted mb-0">Easily report urban issues with our intuitive interface. Take photos, mark locations, and describe problems in just a few clicks.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="feature-icon bg-success bg-gradient text-white rounded-circle mb-4 mx-auto" style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-map-marked-alt fa-2x"></i>
                </div>
                <h3 className="h4 mb-3">{t('location')}</h3>
                <p className="text-muted mb-0">Precise location tracking ensures accurate problem reporting. Our system automatically maps and categorizes issues by area.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="feature-icon bg-info bg-gradient text-white rounded-circle mb-4 mx-auto" style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-brain fa-2x"></i>
                </div>
                <h3 className="h4 mb-3">AI Detection</h3>
                <p className="text-muted mb-0">Advanced AI algorithms analyze reported issues, categorize problems, and suggest optimal solutions for faster resolution.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary mb-0">500+</h2>
              <p className="text-muted">Issues Resolved</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary mb-0">50k+</h2>
              <p className="text-muted">Active Users</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary mb-0">95%</h2>
              <p className="text-muted">Satisfaction Rate</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary mb-0">24/7</h2>
              <p className="text-muted">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h2 className="mb-4">Ready to Make Your City Better?</h2>
            <p className="lead mb-4">Join thousands of citizens who are already making a difference in their communities with SmartEye.</p>
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Start Reporting Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;