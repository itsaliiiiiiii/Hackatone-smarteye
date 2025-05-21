import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState({
    totalProblems: 0,
    resolvedProblems: 0,
    pendingProblems: 0,
    inProgressProblems: 0
  });
  const [problemsByType, setProblemsByType] = useState([]);
  const [problemsByRegion, setProblemsByRegion] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // TODO: Fetch statistics from API
    // This is mock data for now
    setStatistics({
      totalProblems: 150,
      resolvedProblems: 75,
      pendingProblems: 45,
      inProgressProblems: 30
    });

    setProblemsByType([
      { type: 'Road Damage', count: 40 },
      { type: 'Lighting', count: 30 },
      { type: 'Waste', count: 45 },
      { type: 'Infrastructure', count: 35 }
    ]);

    setProblemsByRegion([
      { region: 'North', count: 45 },
      { region: 'South', count: 35 },
      { region: 'East', count: 40 },
      { region: 'West', count: 30 }
    ]);
  }, []);

  const problemTypeChartData = {
    labels: problemsByType.map(item => item.type),
    datasets: [
      {
        label: 'Problems by Type',
        data: problemsByType.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const problemRegionChartData = {
    labels: problemsByRegion.map(item => item.region),
    datasets: [
      {
        label: 'Problems by Region',
        data: problemsByRegion.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const handleDownloadReport = () => {
    setIsExporting(true);
    try {
      // Generate CSV content
      const csvContent = [
        // Header
        ['SmartEye Statistics Report', '', '', ''],
        ['Generated at:', new Date().toLocaleString(), '', ''],
        ['', '', '', ''],
        
        // Overall Statistics
        ['Overall Statistics', '', '', ''],
        ['Metric', 'Value', '', ''],
        ['Total Problems', statistics.totalProblems, '', ''],
        ['Resolved Problems', statistics.resolvedProblems, '', ''],
        ['Pending Problems', statistics.pendingProblems, '', ''],
        ['In Progress Problems', statistics.inProgressProblems, '', ''],
        ['', '', '', ''],
        
        // Problems by Type
        ['Problems by Type', '', '', ''],
        ['Type', 'Count', '', ''],
        ...problemsByType.map(item => [item.type, item.count, '', '']),
        ['', '', '', ''],
        
        // Problems by Region
        ['Problems by Region', '', '', ''],
        ['Region', 'Count', '', ''],
        ...problemsByRegion.map(item => [item.region, item.count, '', '']),
      ]
        .map(row => row.join(','))
        .join('\n');

      // Create Blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `smarteye_statistics_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="mb-4 border-bottom pb-2">SmartEye Admin</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/backoffice" className="nav-link active text-white">
                <i className="fas fa-chart-line me-2"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/backoffice/problems" className="nav-link text-white-50">
                <i className="fas fa-exclamation-circle me-2"></i>
                Problems
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Dashboard Overview</h2>
            <button 
              className="btn btn-primary" 
              onClick={handleDownloadReport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="fas fa-download me-2"></i>
                  Export Report
                </>
              )}
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                      <i className="fas fa-clipboard-list text-primary fa-2x"></i>
                    </div>
                    <div className="ms-3">
                      <h3 className="mb-1">{statistics.totalProblems}</h3>
                      <p className="text-muted mb-0">Total Problems</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3">
                      <i className="fas fa-check-circle text-success fa-2x"></i>
                    </div>
                    <div className="ms-3">
                      <h3 className="mb-1">{statistics.resolvedProblems}</h3>
                      <p className="text-muted mb-0">Resolved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-3">
                      <i className="fas fa-clock text-warning fa-2x"></i>
                    </div>
                    <div className="ms-3">
                      <h3 className="mb-1">{statistics.pendingProblems}</h3>
                      <p className="text-muted mb-0">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3">
                      <i className="fas fa-spinner text-info fa-2x"></i>
                    </div>
                    <div className="ms-3">
                      <h3 className="mb-1">{statistics.inProgressProblems}</h3>
                      <p className="text-muted mb-0">In Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row g-4">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Problems by Region</h5>
                  <Bar data={problemRegionChartData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Problems by Type</h5>
                  <Pie data={problemTypeChartData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;