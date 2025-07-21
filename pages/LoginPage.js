import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './studentdashboard.css'; // make sure this CSS file exists

const LoginPage = () => {
  const [error, setError] = useState('');
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

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/accounts/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('studentEmail', res.data.data.email);
        localStorage.setItem('studentName', res.data.data.name);
        navigate('/student-dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Student Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="login-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default LoginPage;
