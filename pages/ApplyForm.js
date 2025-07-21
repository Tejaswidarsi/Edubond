import React, { useState } from 'react';
import './student.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requiredAmount: '',
    educationLevel: '',
    currentClassOrProgram: '',
    institutionName: '',
    story: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    video: null,
    photo: null,
    incomeProof: null
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInEmail = localStorage.getItem('studentEmail');
    if (formData.email !== loggedInEmail) {
      alert('❌ Email mismatch: Please use the same email as you used to log in.');
      return;
    }
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/students/apply', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Application submitted successfully!');
      console.log(res.data);
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 1000);
    } catch (err) {
      alert('❌ You have already submitted');
      console.error(err);
    }
  };

  return (
    <div className="apply-form-container">
      <div className="apply-form-header">
        <h2>Apply for Educational Support</h2>
      </div>
      <form onSubmit={handleSubmit} className="apply-form" encType="multipart/form-data">
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="form-input" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="form-input" />
        <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} required className="form-input">
          <option value="">Select Education Level</option>
          <option value="School">School</option>
          <option value="College">College</option>
          <option value="University">University</option>
          <option value="Masters">Masters</option>
          <option value="Other">Other</option>
        </select>
        <input name="currentClassOrProgram" placeholder="Current Class or Program" value={formData.currentClassOrProgram} onChange={handleChange} required className="form-input" />
        <input name="institutionName" placeholder="Institution Name" value={formData.institutionName} onChange={handleChange} required className="form-input" />
        <textarea name="story" placeholder="Tell us your story (max 500 words)" value={formData.story} onChange={handleChange} required maxLength={3000} rows="5" className="form-textarea" />
        <label className="form-label">Upload Your Photo:</label>
        <input type="file" name="photo" accept="image/*" onChange={handleChange} required className="form-file" />
        <label className="form-label">Upload Income Proof (PDF):</label>
        <input
          type="file"
          name="incomeProof"
          accept="application/pdf"
          onChange={handleChange}
          required
          className="form-file"
        />
        <label className="form-label">Upload a Video:</label>
        <input type="file" name="video" accept="video/*" onChange={handleChange} className="form-file" />
        <input
  type="number"
  name="requiredAmount"
  placeholder="Required Amount (₹)"
  value={formData.requiredAmount}
  onChange={handleChange}
  required
  min="2"
  className="form-input"
/>
        <input name="accountHolderName" placeholder="Account Holder Name" value={formData.accountHolderName} onChange={handleChange} required className="form-input" />
        <input name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} required pattern="\d{9,18}" className="form-input" />
        <input name="ifscCode" placeholder="IFSC Code" value={formData.ifscCode} onChange={handleChange} required pattern="[A-Z]{4}0[A-Z0-9]{6}" className="form-input" />
        <input name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} required className="form-input" />
        <input name="upiId" placeholder="UPI ID (optional)" value={formData.upiId} onChange={handleChange} className="form-input" />
        <div className="form-buttons">
          <button type="submit" className="btn-submit">Submit Application</button>
          <button type="button" onClick={() => navigate('/student-dashboard')} className="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;