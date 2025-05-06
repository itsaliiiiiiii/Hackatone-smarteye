import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4 mb-4">{t('welcome')}</h1>
          <p className="lead mb-5">{t('description')}</p>
          
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/register" className="btn btn-primary btn-lg px-4 gap-3">
              {t('register')}
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
              {t('login')}
            </Link>
          </div>

          <div className="mt-5">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="urban-card p-4">
                  <i className="fas fa-camera-retro fa-2x mb-3 text-primary"></i>
                  <h3 className="h5">{t('reportProblem')}</h3>
                  <p className="text-muted">Report issues with photos and location</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="urban-card p-4">
                  <i className="fas fa-map-marked-alt fa-2x mb-3 text-success"></i>
                  <h3 className="h5">{t('location')}</h3>
                  <p className="text-muted">Precise location tracking</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="urban-card p-4">
                  <i className="fas fa-brain fa-2x mb-3 text-info"></i>
                  <h3 className="h5">AI Detection</h3>
                  <p className="text-muted">Smart issue classification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;