import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './student.css';

const SponsorRegister = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sponsor/register', formData);
      localStorage.setItem('studentEmail', formData.email);
      if (formData.password.length < 8) {
  setError("Password must be at least 8 characters");
  return;
}
      navigate('/sponsor-login');
    } catch (err) {
  console.error("Registration Error:", err.response?.data || err.message);
  alert("Error: " + (err.response?.data?.message || JSON.stringify(err.response?.data || err.message)));
  setError(err.response?.data?.message || 'Registration failed');
}



  };
    return (
   <div className="register-container">
  <h2 className="register-title">Sponsor Register</h2>
  <form onSubmit={handleSubmit} className="register-form">
    <input
      name="name"
      placeholder="Full Name"
      value={formData.name}
      onChange={handleChange}
      required
      className="register-input1"
    />
    <input
      name="email"
      type="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
      className="register-input1"
    />
    <input
      name="password"
      type="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      required
      className="register-input1"
    />
    {error && <p className="register-error">{error}</p>}
    <button type="submit" className="register-button1">Register</button>
  </form>
  <p className="register-footer">
    Already have an account?{' '}
    <span className="register-login-link1" onClick={() => navigate('/sponsor-login')}>
      Login
    </span>
  </p>
</div>

  );
};
export default SponsorRegister;