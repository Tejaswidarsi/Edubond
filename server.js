// server.js
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Verify .env file exists
const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error(`❌ .env file not found at: ${envPath}`);
} else {
  console.log(`✅ .env file found at: ${envPath}`);
}

// Load .env file
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.error('❌ Error loading .env file:', dotenvResult.error.message);
} else {
  console.log('✅ .env file loaded successfully');
}

console.log('DEBUG: RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'undefined');
console.log('DEBUG: RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET || 'undefined');
console.log('DEBUG: MONGO_URI:', process.env.MONGO_URI || 'undefined');
console.log('DEBUG: PORT:', process.env.PORT || 'undefined');

const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const accountRoutes = require('./routes/AccountRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const sponsorRoutes = require('./routes/SponsorRoutes');

const app = express();

// Initialize Razorpay with fallback
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.warn('⚠️ Razorpay keys missing. Razorpay routes will be disabled.');
  }
} catch (err) {
  console.error('❌ Error initializing Razorpay:', err.message);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sponsor', sponsorRoutes);
app.use('/uploads', express.static('Uploads'));

// Test endpoint
app.get('/', (req, res) => {
  res.send('EduBond Backend Running');
});

// Payment process endpoint (optional, for testing)
app.post('/payment/process', (req, res) => {
  res.status(200).json({ success: true });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));