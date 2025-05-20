import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const AIAnalysis = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Location state:", location.state); // Log the location state to verify its contents

    if (location.state?.aiResults) {
      const predictions = location.state.aiResults[0]?.[0] || {}; // Safely access predictions
      setAnalysis({
        problemType: predictions.class || 'Unknown', // Provide default values
        severity: predictions.severity || 'N/A', // Provide default values
        priority: predictions.priority || 'N/A', // Provide default values
        responsibleAgency: predictions.agency || 'N/A', // Provide default values
        estimatedTimeToFix: predictions.estimatedTime || 'N/A', // Provide default values
        similarCases: predictions.similarCases || 'N/A', // Provide default values
        annotatedImage: location.state.annotatedImage, // Ensure this field is used
        location: location.state.location,
        recommendations: predictions.recommendations || []
      });
      console.log("Annotated Image Base64:", location.state.annotatedImage); // Log the base64 string
      setLoading(false);
    }
  }, [location]);
  if (loading || !analysis) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Analyzing problem details...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">AI Analysis Results</h2>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Problem Details</h5>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Type:</span>
                      <strong>{analysis.problemType}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Severity:</span>
                      <strong>{analysis.severity}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Priority:</span>
                      <strong>{analysis.priority}</strong>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Resolution Details</h5>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Agency:</span>
                      <strong>{analysis.responsibleAgency}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Est. Time:</span>
                      <strong>{analysis.estimatedTimeToFix}</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Similar Cases:</span>
                      <strong>{analysis.similarCases}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-4">
                <h5>Annotated Image Analysis</h5>
                <div className="border rounded overflow-hidden text-center">
                  {analysis.annotatedImage && (
                    <img
                      src={`data:image/png;base64,${analysis.annotatedImage}`}
                      alt="AI Analysis Result"
                      className="img-fluid"
                      style={{ maxHeight: '400px' }}
                    />
                  )}
                </div>
              </div>
              {analysis.location && (
                <div className="mb-4">
                  <h5>Location</h5>
                  <div className="border rounded overflow-hidden">
                    <MapContainer
                      center={[analysis.location.lat, analysis.location.lng]}
                      zoom={13}
                      style={{ height: '300px' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[analysis.location.lat, analysis.location.lng]} />
                    </MapContainer>
                  </div>
                </div>
              )}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="mb-4">
                  <h5>Recommendations</h5>
                  <ul className="list-group">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="list-group-item">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="d-grid gap-2">
                <button className="btn btn-primary">
                  Track Progress
                </button>
                <button className="btn btn-outline-secondary">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;