import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    problemType: ''
  });

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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
                    disabled={mediaFiles.length === 0 || !position || !formData.problemType}
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