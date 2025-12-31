// server.js (ES Module version without .env)

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import cors from 'cors';

// 🔧 Fix __dirname in ES Modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes (ESM import)
import studentRoutes from './routes/studentRoutes.js';
import accountRoutes from './routes/AccountRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import sponsorRoutes from './routes/SponsorRoutes.js';

const app = express();

// 🔹 Initialize Razorpay (optional)
let razorpay;
try {
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
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
const PORT = PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

