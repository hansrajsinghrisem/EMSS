import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    validate: {
      validator: (value) => mongoose.isValidObjectId(value),
      message: 'Invalid user ID',
    },
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: 'End date must be on or after start date',
    },
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority',
    },
    required: [true, 'Priority is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['yet to be checked', 'under consideration', 'approved', 'denied'],
      message: '{VALUE} is not a valid status',
    },
    default: 'yet to be checked',
  },
  adminComment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on save
leaveRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema);