import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './studentdashboard.css'; // Keep your styling

const SponsorLogin = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/sponsor/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.message === "Login successful") {
  // Consider it success anyway, just for now
  localStorage.setItem('sponsorToken', res.data.data?.token || '');
  localStorage.setItem('sponsorEmail', res.data.data?.email || '');
  localStorage.setItem('sponsorName', res.data.data?.name || '');
  setSuccess('Login successful');
  navigate('/sponsor-dashboard');
} else if (res.data.success) {
  // Normal success path
  localStorage.setItem('sponsorToken', res.data.data.token);
  localStorage.setItem('sponsorEmail', res.data.data.email);
  localStorage.setItem('sponsorName', res.data.data.name);
  setSuccess('Login successful');
  navigate('/sponsor-dashboard');
} else {
  setError(res.data.message || 'Login failed');
}

    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sponsor Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="login-input1"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input1"
        />
        <button type="submit" className="login-button1">
          Login
        </button>
      </form>
      {success && <p className="login-success">{success}</p>}
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default SponsorLogin;
