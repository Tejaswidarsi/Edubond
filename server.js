// server.js (ES Module version)

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import cors from 'cors';

// 🔧 Fix __dirname in ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔐 Load .env file
const envPath = path.resolve(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error(`.env file not found at: ${envPath}`);
} else {
  console.log(`.env file found at: ${envPath}`);
}

const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error.message);
} else {
  console.log('.env file loaded successfully');
}

// Debug logs (safe for testing, remove later)
console.log('DEBUG: RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'undefined');
console.log('DEBUG: RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET || 'undefined');
console.log('DEBUG: MONGO_URI:', process.env.MONGO_URI ? 'loaded' : 'undefined');
console.log('DEBUG: PORT:', process.env.PORT || 'undefined');

// Routes (ESM import)
import studentRoutes from './routes/studentRoutes.js';
import accountRoutes from './routes/AccountRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import sponsorRoutes from './routes/SponsorRoutes.js';

const app = express();

// 🔹 Initialize Razorpay (optional)
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully');
  } else {
    console.warn('Razorpay keys missing. Razorpay routes will be disabled.');
  }
} catch (err) {
  console.error('Error initializing Razorpay:', err.message);
}

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sponsor', sponsorRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Test endpoint
app.get('/', (req, res) => {
  res.send('EduBond Backend Running');
});

// Payment test endpoint
app.post('/payment/process', (req, res) => {
  res.status(200).json({ success: true });
});

// 🔗 MongoDB + Server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
