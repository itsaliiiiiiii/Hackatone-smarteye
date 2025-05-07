import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
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
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    problemType: ''
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const problemTypes = [
    'Road Damage',
    'Flooding',
    'Electrical Issue',
    'Water Supply Problem',
    'Waste Disposal',
    'Public Safety',
    'Others'
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const type = file.type.split('/')[0];
      return type === 'image' || type === 'video';
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles(prev => [...prev, {
          url: reader.result,
          type: file.type.split('/')[0],
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      ...formData,
      mediaFiles,
      location: position,
      date: new Date().toISOString(),
    };
    console.log('Report submitted:', reportData);
    // Here you would typically make an API call to submit the report
    navigate('/ai-analysis'); // Navigate to AI Analysis page after submission
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 30000, // Increased timeout
        maximumAge: 0
      };

      const successCallback = (position) => {
        if (position && position.coords) {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setPosition(newPosition);
          setLocationError(''); // Clear any existing errors
          setIsLoadingLocation(false);
        } else {
          setLocationError('Unable to get precise location. Please try again.');
          setIsLoadingLocation(false);
        }
      };

      const errorCallback = (error) => {
        setIsLoadingLocation(false);
        console.error('Geolocation error:', error);

        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setLocationError('Please allow location access in your browser settings and try again.');
            break;
          case 2: // POSITION_UNAVAILABLE
            setLocationError('Location service is not available. Please check if your GPS is enabled and try again.');
            break;
          case 3: // TIMEOUT
            setLocationError('Location request took too long. Please ensure you have a stable internet connection and try again.');
            break;
          default:
            setLocationError('Unable to get your location. Please try again.');
        }
      };

      try {
        navigator.geolocation.getCurrentPosition(
          successCallback,
          errorCallback,
          options
        );
      } catch (err) {
        console.error('Error requesting location:', err);
        setLocationError('Unable to access location services. Please ensure location permissions are granted.');
        setIsLoadingLocation(false);
      }
    } else {
      setIsLoadingLocation(false);
      setLocationError('Your browser does not support geolocation. Please use a modern browser.');
    }
  };

  const isFormValid = () => {
    return mediaFiles.length > 0 && !!position && !!formData.problemType && !!formData.description.trim();
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
                  <div className="d-flex flex-wrap gap-3 mb-3">
                    {mediaFiles.map((media, index) => (
                      <div key={index} className="position-relative" style={{ width: '200px' }}>
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Upload ${index + 1}`}
                            className="img-fluid rounded"
                          />
                        ) : (
                          <video
                            src={media.url}
                            className="img-fluid rounded"
                            controls
                            style={{ maxHeight: '200px' }}
                          />
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          onClick={() => removeFile(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}

                    {mediaFiles.length === 0 && (
                      <div
                        className="border rounded d-flex align-items-center justify-content-center"
                        style={{ height: '200px', width: '200px', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <div className="text-center">
                          <i className="fas fa-upload fa-2x mb-2"></i>
                          <p className="mb-0">{t('uploadMedia')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    multiple
                  />

                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {t('uploadMedia')}
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label">Problem Type</label>
                  <select
                    className="form-select"
                    value={formData.problemType}
                    onChange={(e) => setFormData(prev => ({ ...prev, problemType: e.target.value }))}
                    required
                  >
                    <option value="">Select a problem type</option>
                    {problemTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">{t('location')}</label>
                  <button
                    type="button"
                    className="btn btn-outline-primary mb-3 w-100"
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Getting location...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-location-arrow me-2"></i>
                        Use Current Location
                      </>
                    )}
                  </button>
                  {locationError && (
                    <div className="alert alert-danger mb-3">{locationError}</div>
                  )}

                  <div className="border rounded overflow-hidden">
                    <MapContainer
                      center={position || [31.7917, -7.0926]} // Default to Morocco's center
                      zoom={position ? 13 : 6}
                      style={{ height: '400px' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  </div>
                  {!position && (
                    <div className="form-text text-muted mt-2">
                      Please select a location by clicking on the map or using your current location.
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={!isFormValid()}
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