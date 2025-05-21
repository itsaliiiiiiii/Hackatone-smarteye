
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

// Import backoffice pages
import Dashboard from './pages/backoffice/Dashboard';
import ProblemList from './pages/backoffice/ProblemList';

function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">SmartEye</a>
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
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/">{t('dashboard')}</Link>
                </li> */}
                {isAuthenticated && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/report-problem">{t('reportProblem')}</Link>
                  </li>
                )}
              </ul>
              <div className="d-flex align-items-center">
                <LanguageSwitcher />
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="btn btn-outline-danger ms-3">
                    <i className="fas fa-sign-out-alt me-1"></i>
                    {t('logout')}
                  </button>
                ) : (
                  <div className="d-flex gap-2 ms-3">
                    <Link to="/login" className="btn btn-outline-primary">
                      {t('login')}
                    </Link>
                    <Link to="/register" className="btn btn-outline-success">
                      {t('register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          {/* Frontoffice Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report-problem" element={<ReportProblem />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />

          {/* Backoffice Routes */}
          <Route path="/backoffice" element={<Dashboard />} />
          <Route path="/backoffice/problems" element={<ProblemList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
