import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const ReportProblem = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedProblem, setDetectedProblem] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    problemType: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        simulateAIDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIDetection = () => {
    setIsDetecting(true);
    const problems = ['Pothole', 'Broken Streetlight', 'Garbage', 'Graffiti', 'Broken Sidewalk'];
    setTimeout(() => {
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      setDetectedProblem(randomProblem);
      setFormData(prev => ({ ...prev, problemType: randomProblem }));
      setIsDetecting(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      ...formData,
      image,
      location: position,
      date: new Date().toISOString(),
    };
    console.log('Report submitted:', reportData);
    // Here you would typically make an API call to submit the report
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{t('reportProblem')}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="d-flex justify-content-center mb-3">
                    {image ? (
                      <img
                        src={image}
                        alt="Problem"
                        className="img-fluid rounded"
                        style={{ maxHeight: '300px' }}
                      />
                    ) : (
                      <div
                        className="border rounded d-flex align-items-center justify-content-center"
                        style={{ height: '300px', width: '100%', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <div className="text-center">
                          <i className="fas fa-camera fa-3x mb-3"></i>
                          <p>{t('uploadImage')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {image ? t('uploadImage') : t('takePhoto')}
                  </button>
                </div>

                {isDetecting && (
                  <div className="ai-detecting mb-3">
                    <i className="fas fa-brain me-2"></i>
                    Detecting problem type...
                  </div>
                )}

                {detectedProblem && (
                  <div className="mb-3">
                    <label className="form-label">{t('problemType')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.problemType}
                      onChange={(e) => setFormData(prev => ({ ...prev, problemType: e.target.value }))}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">{t('location')}</label>
                  <button
                    type="button"
                    className="btn btn-outline-primary mb-3 w-100"
                    onClick={getCurrentLocation}
                  >
                    <i className="fas fa-location-arrow me-2"></i>
                    Use Current Location
                  </button>
                  
                  <div className="border rounded overflow-hidden">
                    <MapContainer
                      center={position || [31.7917, -7.0926]} // Default to Morocco's center
                      zoom={13}
                      style={{ height: '400px' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={!image || !position || !formData.problemType}
                  >
                    {t('submit')}
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

export default ReportProblem;