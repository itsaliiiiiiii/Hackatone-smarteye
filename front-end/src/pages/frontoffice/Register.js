import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    cin: '',
    region: '',
    city: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.cin.trim()) {
      newErrors.cin = 'CIN is required';
    }
    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Here you would typically make an API call to register the user
      console.log('Form submitted:', formData);
      navigate('/login');
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
              <h2 className="text-center mb-4">{t('register')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">{t('fullName')}</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>

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
                  <label htmlFor="password" className="form-label">{t('password')}</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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

                <div className="mb-3">
                  <label htmlFor="region" className="form-label">{t('region')}</label>
                  <input
                    type="text"
                    className={`form-control ${errors.region ? 'is-invalid' : ''}`}
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                  />
                  {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">{t('city')}</label>
                  <input
                    type="text"
                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {t('register')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;