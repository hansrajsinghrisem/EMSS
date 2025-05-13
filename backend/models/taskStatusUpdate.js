import mongoose from 'mongoose';

const taskStatusUpdateSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required'],
    validate: {
      validator: (value) => mongoose.isValidObjectId(value),
      message: 'Invalid task ID',
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    validate: {
      validator: (value) => mongoose.isValidObjectId(value),
      message: 'Invalid user ID',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed', 'on-hold'],
      message: '{VALUE} is not a valid status',
    },
    required: [true, 'Status is required'],
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TaskStatusUpdate || mongoose.model('TaskStatusUpdate', taskStatusUpdateSchema);