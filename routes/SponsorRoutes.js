const express = require('express');
const bcrypt = require('bcryptjs');
const Sponsor = require('../models/Sponsor');
const Student = require('../models/student');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// Verify Razorpay keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Razorpay key_id or key_secret is missing in environment variables');
  throw new Error('Razorpay key_id or key_secret is missing');
}
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // e.g., rzp_test_3
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Register sponsor
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Sponsor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const sponsor = new Sponsor({ name, email, password: hashedPassword });
    await sponsor.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering sponsor', error: err.message });
  }
});

// Login sponsor
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sponsor = await Sponsor.findOne({ email });
    if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });

    const isMatch = await bcrypt.compare(password, sponsor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      sponsor: { name: sponsor.name, email: sponsor.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Fetch Students
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
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Razorpay service unavailable due to missing keys' });
  }

  console.log('DEBUG: Using key_id:', process.env.RAZORPAY_KEY_ID);
  const { amount } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// Handle payment success and verification
router.post('/payment-success', async (req, res) => {
  
  const { studentId, transactionId, orderId, signature, amount } = req.body;

  try {
    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${transactionId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update student's received amount
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.received += amount;
    student.statusProgress =
      student.received >= student.requiredAmount ? 'Completed' : 'Partially Funded';
    await student.save();

    res.status(200).json({ message: 'Payment verified and student updated' });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
});

module.exports = router;
