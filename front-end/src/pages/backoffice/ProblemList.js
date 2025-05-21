import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ProblemList = () => {
  const { t } = useTranslation();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filter, setFilter] = useState({
    status: 'all',
    type: 'all',
    region: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'reportedAt',
    direction: 'desc'
  });

  useEffect(() => {
    // TODO: Fetch problems from API
    // Mock data for now
    const mockProblems = [
      {
        id: 1,
        type: 'Road Damage',
        description: 'Large pothole in main street',
        location: { lat: 34.0522, lng: -118.2437 },
        status: 'pending',
        priority: 'high',
        reportedAt: '2024-01-15T10:30:00',
        region: 'North',
        images: ['image1.jpg'],
        reporter: 'John Doe',
        votes: 15
      },
      {
        id: 2,
        type: 'Lighting',
        description: 'Street light not working',
        location: { lat: 34.0522, lng: -118.2437 },
        status: 'in_progress',
        priority: 'medium',
        reportedAt: '2024-01-14T15:45:00',
        region: 'South',
        images: ['image2.jpg'],
        reporter: 'Jane Smith',
        votes: 8
      },
      {
        id: 3,
        type: 'Waste',
        description: 'Illegal dumping site',
        location: { lat: 34.0522, lng: -118.2437 },
        status: 'resolved',
        priority: 'low',
        reportedAt: '2024-01-13T09:15:00',
        region: 'East',
        images: ['image3.jpg'],
        reporter: 'Mike Johnson',
        votes: 12
      }
    ];
    setProblems(mockProblems);
    setLoading(false);
  }, []);

  const handleStatusChange = async (problemId, newStatus) => {
    try {
      // TODO: Update status via API
      setProblems(prevProblems =>
        prevProblems.map(problem =>
          problem.id === problemId
            ? { ...problem, status: newStatus }
            : problem
        )
      );

      // Update selectedProblem if it's the one being changed
      if (selectedProblem && selectedProblem.id === problemId) {
        setSelectedProblem(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedProblems = [...problems].sort((a, b) => {
    if (sortConfig.key === 'reportedAt') {
      return sortConfig.direction === 'asc'
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    } else if (sortConfig.key === 'id' || sortConfig.key === 'votes') {
      // Numeric sorting
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    } else {
      // String sorting
      return sortConfig.direction === 'asc'
        ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
        : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
    }
  });

  const filteredProblems = sortedProblems.filter(problem => {
    const matchesFilter =
      (filter.status === 'all' || problem.status === filter.status) &&
      (filter.type === 'all' || problem.type === filter.type) &&
      (filter.region === 'all' || problem.region === filter.region);

    const matchesSearch = filter.search === '' ||
      problem.description.toLowerCase().includes(filter.search.toLowerCase()) ||
      problem.reporter.toLowerCase().includes(filter.search.toLowerCase()) ||
      problem.type.toLowerCase().includes(filter.search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'in_progress': return 'bg-info';
      case 'resolved': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="mb-4 border-bottom pb-2">SmartEye Admin</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/backoffice" className="nav-link text-white-50">
                <i className="fas fa-chart-line me-2"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/backoffice/problems" className="nav-link active text-white">
                <i className="fas fa-exclamation-circle me-2"></i>
                Problems
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <div className="container-fluid py-4">
          <div className="row mb-4">
            <div className="col">
              <h1 className="h3 mb-0 text-gray-800">Problem Management</h1>
            </div>
          </div>

          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              <div className="d-flex gap-3 flex-grow-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search problems..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                />
                <select
                  className="form-select w-auto"
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  className="form-select w-auto"
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">All Types</option>
                  <option value="Road Damage">Road Damage</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Waste">Waste</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
                <select
                  className="form-select w-auto"
                  value={filter.region}
                  onChange={(e) => setFilter(prev => ({ ...prev, region: e.target.value }))}
                >
                  <option value="all">All Regions</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                        ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                        Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Description</th>
                      <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>
                        Priority {sortConfig.key === 'priority' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('region')} style={{ cursor: 'pointer' }}>
                        Region {sortConfig.key === 'region' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('reportedAt')} style={{ cursor: 'pointer' }}>
                        Reported At {sortConfig.key === 'reportedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('votes')} style={{ cursor: 'pointer' }}>
                        Votes {sortConfig.key === 'votes' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map(problem => (
                      <tr key={problem.id}>
                        <td>{problem.id}</td>
                        <td>{problem.type}</td>
                        <td>
                          <div style={{ maxWidth: '200px' }} className="text-truncate" title={problem.description}>
                            {problem.description}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(problem.status)}`}>
                            {problem.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadgeClass(problem.priority)}`}>
                            {problem.priority.toUpperCase()}
                          </span>
                        </td>
                        <td>{problem.region}</td>
                        <td>{format(new Date(problem.reportedAt), 'MMM dd, yyyy HH:mm')}</td>
                        <td>{problem.votes}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedProblem(problem)}
                              data-bs-toggle="modal"
                              data-bs-target="#problemDetailsModal"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {problem.status !== 'in_progress' && problem.status !== 'resolved' && (
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleStatusChange(problem.id, 'in_progress')}
                                title="Mark as In Progress"
                              >
                                <i className="fas fa-hourglass-half"></i>
                              </button>
                            )}
                            {problem.status !== 'resolved' && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleStatusChange(problem.id, 'resolved')}
                                title="Mark as Resolved"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            <button className="btn btn-sm btn-outline-danger" title="Delete">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Problem Details Modal */}
          <div className="modal fade" id="problemDetailsModal" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Problem Details</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  {selectedProblem && (
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Basic Information</h6>
                        <p><strong>ID:</strong> {selectedProblem.id}</p>
                        <p><strong>Type:</strong> {selectedProblem.type}</p>
                        <p><strong>Description:</strong> {selectedProblem.description}</p>
                        <p><strong>Reporter:</strong> {selectedProblem.reporter}</p>
                        <p><strong>Votes:</strong> {selectedProblem.votes}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Status Information</h6>
                        <p>
                          <strong>Status:</strong>
                          <span className={`badge ms-2 ${getStatusBadgeClass(selectedProblem.status)}`}>
                            {selectedProblem.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </p>
                        <p>
                          <strong>Priority:</strong>
                          <span className={`badge ms-2 ${getPriorityBadgeClass(selectedProblem.priority)}`}>
                            {selectedProblem.priority.toUpperCase()}
                          </span>
                        </p>
                        <p><strong>Region:</strong> {selectedProblem.region}</p>
                        <p><strong>Reported At:</strong> {format(new Date(selectedProblem.reportedAt), 'PPpp')}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  {selectedProblem && selectedProblem.status === 'pending' && (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        handleStatusChange(selectedProblem.id, 'in_progress');
                      }}
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {selectedProblem && selectedProblem.status !== 'resolved' && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        handleStatusChange(selectedProblem.id, 'resolved');
                      }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;