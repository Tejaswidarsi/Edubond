import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sponsor.css';

function SponsorDashboard() {
  const [students, setStudents] = useState([]);
  const [paymentInputs, setPaymentInputs] = useState({});
  const [sponsorEmail, setSponsorEmail] = useState('test@example.com');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Fetch student data
  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sponsor/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('Failed to load student data');
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setRazorpayLoaded(true);
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Payment Handler
  const handlePayment = async (student) => {
    const amount = parseFloat(paymentInputs[student._id]);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!razorpayLoaded && !(await loadRazorpayScript())) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/sponsor/create-order', { amount });
      const { id: order_id, currency, amount: razorpay_amount } = response.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || rzp_test_jKxPrPXBbYWDVo,
        amount: razorpay_amount,
        currency,
        name: 'EduBond',
        description: `Sponsoring ${student.name}`,
        order_id,
        handler: async (response) => {
          try {
            await axios.post('http://localhost:5000/api/sponsor/payment-success', {
              studentId: student._id,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount,
            });
            alert(`Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
            fetchStudents();
          } catch (err) {
            console.error('Error recording payment:', err);
            alert('Payment done, but failed to notify server. Contact support.');
          }
        },
        prefill: {
          email: sponsorEmail,
          contact: '9441766348',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create payment order');
    }
  };

  return (
    <div className="sponsor-dashboard">
      <div className="sponsor-container">
        <h2 className="sponsor-header">EduBond Sponsor Dashboard</h2>

        {students.length === 0 ? (
          <p className="no-students-message">
            <i className="fas fa-check-circle me-2 text-secondary"></i>
            No students currently need funding 🎉
          </p>
        ) : (
          students.map((student) => (
            <div key={student._id} className="student-profile-card">
              <div className="student-profile-content">
                <img
                  src={`http://localhost:5000/uploads/${student.photoUrl}`}
                  alt={`${student.name}`}
                  className="student-profile-image"
                  onError={(e) => {
                    e.target.src = 'default-image.jpg';
                  }}
                />
                <div className="student-info-section">
                  <h3 className="student-name">{student.name}</h3>
                  <p><i className="fas fa-graduation-cap me-2 text-secondary"></i>{student.educationLevel} - {student.currentClassOrProgram}</p>
                  <p><i className="fas fa-university me-2 text-secondary"></i>{student.institutionName}</p>
                  <p className="student-story">{student.story}</p>
                  <div className="student-video-section">
                    <video
                      controls
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ maxWidth: '100%', marginTop: '5px' }}
                    >
                      <source src={`http://localhost:5000/uploads/${student.videoUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="funding-details">
                    <p><strong>Required:</strong> ₹{student.requiredAmount}</p>
                    <p><strong>Received:</strong> ₹{student.received}</p>
                    <p><strong>Remaining:</strong> ₹{student.requiredAmount - student.received}</p>
                  </div>
                  <div className="payment-section">
                    <input
                      type="number"
                      placeholder="Enter amount to pay"
                      min="1"
                      value={paymentInputs[student._id] || ''}
                      onChange={(e) =>
                        setPaymentInputs({ ...paymentInputs, [student._id]: e.target.value })
                      }
                      className="payment-input-field"
                    />
                    <button
                      onClick={() => handlePayment(student)}
                      className="payment-submit-button"
                    >
                      <i className="fas fa-money-check-alt"></i> Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="footer">
        <p>
          Contact: <a href="mailto:tejaswi_darsi@srmap.edu.in">tejaswi_darsi@srmap.edu.in</a> | +91 94417 66348
        </p>
      </footer>
    </div>
  );
}

export default SponsorDashboard;
