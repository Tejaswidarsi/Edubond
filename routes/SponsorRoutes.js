import express from 'express';
import bcrypt from 'bcryptjs';
import Sponsor from '../models/Sponsor.js';
import Student from '../models/student.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// ⚠️ Do NOT crash server if keys are missing
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized');
} else {
  console.warn('⚠️ Razorpay keys missing. Payment routes will be disabled.');
}

// Register sponsor
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Sponsor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sponsor = new Sponsor({ name, email, password: hashedPassword });
    await sponsor.save();

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering sponsor', error: err.message });
  }
});

// Login sponsor
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sponsor = await Sponsor.findOne({ email });
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    const isMatch = await bcrypt.compare(password, sponsor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      sponsor: { name: sponsor.name, email: sponsor.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Fetch students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({
      $or: [
        { statusProgress: 'Approved' },
        { statusProgress: 'Partially Funded' },
      ],
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Razorpay service unavailable' });
  }

  const { amount } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// Payment verification
router.post('/payment-success', async (req, res) => {
  const { studentId, transactionId, orderId, signature, amount } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${transactionId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.received += amount;
    student.statusProgress =
      student.received >= student.requiredAmount
        ? 'Completed'
        : 'Partially Funded';

    await student.save();

    res.status(200).json({ message: 'Payment verified and student updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
});

export default router;
