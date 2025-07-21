import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchAllRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  useEffect(() => {
    fetchAllRequests();
    const interval = setInterval(fetchAllRequests, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const approveRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
      await fetchAllRequests(); // Refetch to update UI
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/reject/${id}`);
      await fetchAllRequests(); // Refetch to update UI
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {requests.map((req) => (
          <div
            key={req._id}
            style={{
              border: '1px solid #ddd',
              padding: '16px',
              width: '350px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
              {req.photoFullPath && (
                <img
                  src={req.photoFullPath}
                  alt="Student Photo"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                  }}
                />
              )}
              <div>
                <h4 style={{ margin: '0' }}>{req.name}</h4>
                <p style={{ margin: '2px 0' }}><strong>Email:</strong> {req.email}</p>
                <p style={{ margin: '2px 0' }}><strong>Current Program:</strong> {req.currentClassOrProgram}</p>
              </div>
            </div>
            <p><strong>Education:</strong> {req.educationLevel}, {req.currentClassOrProgram}</p>
            <p><strong>Institution:</strong> {req.institutionName}</p>
            <p><strong>Purpose:</strong> {req.story?.slice(0, 60)}...</p>
            <p><strong>Required Amount:</strong> ₹{req.requiredAmount}</p>
            <div style={{ margin: '10px 0' }}>
              <strong>Status:</strong>{' '}
              <span style={{ color: req.statusProgress === 'Approved' ? 'green' : req.statusProgress === 'Rejected' ? 'red' : 'orange' }}>
                {req.statusProgress}
              </span>
            </div>
            <div style={{ margin: '10px 0' }}>
              <strong>Income Proof:</strong><br />
              {req.incomeProofFullPath ? (
                <a
                  href={req.incomeProofFullPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    display: 'inline-block',
                    marginTop: '5px',
                  }}
                >
                  View Income Proof
                </a>
              ) : (
                <span style={{ color: 'red' }}>No document uploaded</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => approveRequest(req._id)}
                disabled={['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: ['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress) ? '#ccc' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: ['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress) ? 'not-allowed' : 'pointer',
                }}
              >
                {req.statusProgress === 'Approved' ? 'Approved' : 'Approve Request'}
              </button>
              <button
                onClick={() => rejectRequest(req._id)}
                disabled={['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: ['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress) ? '#ccc' : '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: ['Approved', 'Partially Funded', 'Completed', 'Rejected'].includes(req.statusProgress) ? 'not-allowed' : 'pointer',
                }}
              >
                {req.statusProgress === 'Rejected' ? 'Rejected' : 'Reject Request'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;