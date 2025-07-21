const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/student'); // Changed to match model name
const bcrypt = require('bcrypt');

const BASE_URL = 'http://localhost:5000/uploads';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all-requests', async (req, res) => {
  try {
    const requests = await Student.find({});
    const merged = requests.map((reqItem) => ({
      ...reqItem._doc,
      photoFullPath: reqItem.photoUrl ? `${BASE_URL}/${reqItem.photoUrl}` : '',
incomeProofFullPath: reqItem.incomeProofUrl ? `${BASE_URL}/${reqItem.incomeProofUrl}` : '',
videoFullPath: reqItem.videoUrl ? `${BASE_URL}/${reqItem.videoUrl}` : '',

    }));
    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/approve/:id', async (req, res) => {
  try {
    const request = await Student.findByIdAndUpdate(
      req.params.id,
      { statusProgress: 'Approved' },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request approved', updatedRequest: request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// admin.js
router.put('/reject/:id', async (req, res) => {
  try {
    const request = await Student.findByIdAndUpdate(
      req.params.id,
      { statusProgress: 'Rejected' },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request rejected', updatedRequest: request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;