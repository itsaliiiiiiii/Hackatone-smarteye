
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <div className="d-flex align-items-center">
              <LanguageSwitcher />
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
