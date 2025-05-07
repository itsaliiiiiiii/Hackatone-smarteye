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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Problem types for the dropdown
  const problemTypes = [
    'Road Damage',
    'Flooding',
    'Electrical Issue',
    'Water Supply Problem',
    'Waste Disposal',
    'Public Safety',
    'Others'
  ];

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const type = file.type.split('/')[0];
      return type === 'image' || type === 'video';
    });

    if (validFiles.length === 0) {
      // Show alert if no valid files were selected
      alert('Please select only image or video files.');
      return;
    }

    // Show loading indicator for large files
    if (validFiles.some(file => file.size > 5000000)) { // 5MB threshold
      // For simplicity we'll just show a console message, but you could add a UI indicator
      console.log('Processing large files, please wait...');
    }

    validFiles.forEach(file => {
      // Check file size - limit to 20MB for example
      if (file.size > 20000000) { // 20MB
        alert(`File ${file.name} exceeds the 20MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles(prev => [...prev, {
          url: reader.result,
          type: file.type.split('/')[0],
          file: file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB', // Format size in MB
          timestamp: new Date().getTime()
        }]);
      };
      reader.onerror = () => {
        alert(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset file input value to allow selecting the same file again
    e.target.value = '';
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
                  {/* CSS for the enhanced upload area - Add this to your CSS file */}
                  <style>
                    {`
                      .upload-container {
                        border: 2px dashed #dee2e6;
                        border-radius: 8px;
                        padding: 20px;
                        transition: all 0.3s ease;
                        background-color: #f8f9fa;
                        min-height: 200px;
                      }
                      
                      .upload-container.dragging {
                        border-color: #0d6efd;
                        background-color: rgba(13, 110, 253, 0.05);
                        box-shadow: 0 0 10px rgba(13, 110, 253, 0.2);
                      }
                      
                      .upload-container.empty {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      }
                      
                      .media-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 16px;
                        width: 100%;
                      }
                      
                      .media-item {
                        position: relative;
                        height: 150px;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                      }
                      
                      .media-item:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                      }
                      
                      .media-preview {
                        width: 100%;
                        height: 100%;
                        position: relative;
                      }
                      
                      .preview-image, .preview-video {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
                      
                      .media-overlay {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: linear-gradient(transparent, rgba(0,0,0,0.7));
                        color: white;
                        padding: 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 0.8rem;
                      }
                      
                      .media-name {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        max-width: 70%;
                      }
                      
                      .remove-button {
                        background: rgba(255,255,255,0.3);
                        border: none;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        transition: background 0.2s;
                      }
                      
                      .remove-button:hover {
                        background: rgba(255,255,255,0.5);
                      }
                      
                      .upload-placeholder {
                        text-align: center;
                        color: #6c757d;
                        cursor: pointer;
                        width: 100%;
                      }
                      
                      .upload-icon {
                        margin-bottom: 10px;
                        color: #0d6efd;
                      }
                      
                      .upload-text {
                        font-size: 1.1rem;
                        margin-bottom: 8px;
                        font-weight: 500;
                      }
                      
                      .upload-subtext {
                        font-size: 0.9rem;
                        opacity: 0.7;
                      }
                      
                      .upload-more-btn {
                        background-color: #f8f9fa;
                        border-color: #0d6efd;
                        color: #0d6efd;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                      }
                      
                      .upload-more-btn:hover {
                        background-color: #e9ecef;
                      }
                      
                      .file-type-badge {
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        background: rgba(0,0,0,0.5);
                        color: white;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 0.7rem;
                        text-transform: uppercase;
                      }
                    `}
                  </style>

                  <label className="form-label fw-bold mb-3">
                    <i className="fas fa-cloud-upload-alt me-2 text-primary"></i>
                    Media Files
                  </label>

                  <div
                    className={`upload-container ${isDragging ? 'dragging' : ''} ${mediaFiles.length === 0 ? 'empty' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {mediaFiles.length === 0 ? (
                      <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                        <div className="upload-icon">
                          <i className="fas fa-cloud-upload-alt fa-3x"></i>
                        </div>
                        <p className="upload-text">{t('uploadMedia') || 'Upload Media Files'}</p>
                        <p className="upload-subtext">Drag & drop files here or click to browse</p>
                      </div>
                    ) : (
                      <div className="media-grid">
                        {mediaFiles.map((media, index) => (
                          <div key={index} className="media-item">
                            <div className="media-preview">
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={`Upload ${index + 1}`}
                                  className="preview-image"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  className="preview-video"
                                  controls
                                />
                              )}
                              <div className="file-type-badge">
                                {media.type}
                                {media.size && <span className="ms-1">({media.size})</span>}
                              </div>
                              <div className="media-overlay">
                                <span className="media-name" title={media.name}>{media.name}</span>
                                <button
                                  type="button"
                                  className="remove-button"
                                  onClick={() => removeFile(index)}
                                  aria-label="Remove file"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
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

                  {mediaFiles.length > 0 && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary flex-grow-1 upload-more-btn"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <i className="fas fa-plus"></i>
                        {t('uploadMore') || 'Add More Files'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setMediaFiles([])}
                        title="Clear all files"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  )}

                  <div className="form-text mt-2">
                    <i className="fas fa-info-circle me-1"></i>
                    Supported formats: JPEG, PNG, GIF, and MP4 videos
                  </div>
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