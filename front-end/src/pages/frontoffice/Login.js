import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    cin: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    if (!formData.cin.trim()) {
      newErrors.cin = 'CIN is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Here you would typically make an API call to authenticate the user
      console.log('Login attempt:', formData);
      navigate('/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{t('login')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">{t('phoneNumber')}</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="cin" className="form-label">{t('cin')}</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cin ? 'is-invalid' : ''}`}
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                  />
                  {errors.cin && <div className="invalid-feedback">{errors.cin}</div>}
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {t('login')}
                  </button>
                </div>

                <div className="text-center mt-3">
                  <Link to="/register" className="text-decoration-none">
                    {t('register')}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;