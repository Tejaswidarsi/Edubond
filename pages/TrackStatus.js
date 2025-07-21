import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './TrackStatus.css';

const TrackStatus = () => {
  const { requestId } = useParams();
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const steps = ['Submitted', 'Under Review', 'Approved', 'Partially Funded', 'Completed', 'Rejected'];
  const email = localStorage.getItem('studentEmail');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/status/request/${requestId}`);
        setStatusData(res.data);
        setError('');
      } catch (err) {
        setError('No request found for this account.');
        setStatusData(null);
      }
    };

    if (email) fetchStatus();
    else setError('Login required.');
  }, [email, requestId]);

  const currentIndex = statusData ? steps.indexOf(statusData.statusProgress) : -1;

  return (
    <div className="track-status-container">
      <h2 className="track-status-header">Track Application Status</h2>

      {error && <p className="error-message"><i className="fas fa-exclamation-circle display-25 me-3"></i>{error}</p>}

      {statusData && (
        <div className="status-card">
          <div className="status-info">
            <h3 className="student-name">Hi, {statusData.name}</h3>
            <p><i className="fas fa-university display-25 me-3 text-secondary"></i><strong>Institution:</strong> {statusData.institutionName}</p>
            <p><i className="fas fa-info-circle display-25 me-3 text-secondary"></i><strong>Status:</strong> {statusData.statusProgress}</p>
            <p><i className="fas fa-money-bill-wave display-25 me-3 text-secondary"></i><strong>Amount Received:</strong> ₹{statusData.received}</p>
          </div>

          <div className="status-timeline">
            {steps.map((step, index) => {
              const isActive = index <= currentIndex;
              return (
                <div key={step} className="status-step">
                  <div className={`status-step-circle ${isActive ? 'active' : ''}`}>
                    {index + 1}
                  </div>
                  <p className="status-step-label">{step}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/student-dashboard')}
        className="back-button"
      >
        <i className="fas fa-arrow-left"></i> Back to Dashboard
      </button>
    </div>
  );
};

export default TrackStatus;