import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './studentdashboard.css';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const email = localStorage.getItem('studentEmail');

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/status/${encodeURIComponent(email)}`);
      setRequests(res.data);
    } catch (err) {
      setRequests([]);
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 10000); // Poll every 10 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    } else {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleTrack = () => {
    navigate('/track');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentName');
    navigate('/login');
  };

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Student Dashboard</h2>
        <div className="buttons-container">
          <button
            onClick={() => navigate('/apply')}
            className="finance-request-button"
          >
            Finance Request
          </button>
          <button onClick={handleLogout} className="logout-icon-button" title="Logout">
            <img src="/image/logout.png" alt="Logout" />
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <div className="message-container">
          <p className="message-text">No requests yet.</p>
        </div>
      ) : (
        <div>
          <h3 className="past-requests-title">Past Requests</h3>
          <div className="requests-list">
            {requests.map((req, index) => (
              <div key={index} className="request-card">
                <h4 className="request-purpose-heading">Purpose</h4>
                <p>{req.story ? req.story.split(' ').slice(0, 12).join(' ') + '...' : 'N/A'}</p>
                <p><strong>Institution:</strong> {req.institutionName}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className="status-progress"
                    style={{
                      color:
                        req.statusProgress === 'Approved' ? 'green' :
                        req.statusProgress === 'Rejected' ? 'red' :
                        req.statusProgress === 'Partially Funded' ? 'blue' :
                        req.statusProgress === 'Completed' ? 'purple' : 'orange',
                    }}
                  >
                    {req.statusProgress}
                  </span>
                </p>
                <p><strong>Amount Received:</strong> ₹{req.received}</p>
                <button
                  className="track-button"
                  onClick={() => navigate(`/track/${req._id}`)}
                >
                  Track
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;