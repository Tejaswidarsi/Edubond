import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const studentSchema = new mongoose.Schema({
  requestId: { type: String, default: uuidv4 },
  name: String,
  email: String,
  educationLevel: {
    type: String,
    enum: ['School', 'College', 'University', 'Masters', 'Other'],
    required: true
  },
  requiredAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  currentClassOrProgram: { type: String, required: true },
  institutionName: { type: String, required: true },
  incomeProofUrl: String,
  photoUrl: String,
  videoUrl: String,
  story: { type: String, maxlength: 3000 },
  accountHolderName: String,
  accountNumber: String,
  ifscCode: String,
  bankName: String,
  upiId: String,
  status: { type: String, default: 'Pending' },
  statusProgress: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Approved', 'Partially Funded', 'Completed', 'Rejected'],
    default: 'Submitted'
  },
  received: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export default Student;
