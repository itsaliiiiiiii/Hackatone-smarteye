
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';

// Import components
import LanguageSwitcher from './components/frontoffice/LanguageSwitcher';

// Import pages
import Home from './pages/frontoffice/Home';
import Login from './pages/frontoffice/Login';
import Register from './pages/frontoffice/Register';
import ReportProblem from './pages/frontoffice/ReportProblem';
import AIAnalysis from './pages/frontoffice/AIAnalysis';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">{t('welcome')}</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">{t('dashboard')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/report-problem">{t('reportProblem')}</Link>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <LanguageSwitcher />
                <Link to="/login" className="btn btn-outline-danger ms-3">
                  <i className="fas fa-sign-out-alt me-1"></i>
                  {t('logout')}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report-problem" element={<ReportProblem />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
