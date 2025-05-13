import mongoose from 'mongoose'; // Added import
import Task from '../models/task.js';
import User from '../models/user.js'; // Added import
import TaskStatusUpdate from '../models/taskStatusUpdate.js';

// Create a new task (Admin assigns task to a user)
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;
    
    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.body.createdBy,
      dueDate,
      priority,
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Get all active tasks (not deleted)
export const getAllTasks = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query;
    const sortOptions = {};
    
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find({ isDeleted: false, status: { $ne: 'completed' } })
      .populate('assignedTo', 'fname lname email')
      .populate('createdBy', 'fname lname email')
      .sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Get completed tasks
export const getCompletedTasks = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query;
    const sortOptions = {};
    
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find({ isDeleted: false, status: 'completed' })
      .populate('assignedTo', 'fname lname email')
      .populate('createdBy', 'fname lname email')
      .sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getCompletedTasks:', error);
    res.status(500).json({ message: 'Error fetching completed tasks', error: error.message });
  }
};

// Get deleted tasks
export const getDeletedTasks = async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query;
    const sortOptions = {};
    
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find({ isDeleted: true })
      .populate('assignedTo', 'fname lname email')
      .populate('createdBy', 'fname lname email')
      .sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getDeletedTasks:', error);
    res.status(500).json({ message: 'Error fetching deleted tasks', error: error.message });
  }
};

// Get tasks assigned to a specific user
export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId, isDeleted: false })
      .populate('assignedTo', 'fname lname email')
      .populate('createdBy', 'fname lname email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getUserTasks:', error);
    res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, userId, progress, comment } = req.body;
    const taskId = req.params.taskId;
    console.log('Request body:', { taskId, status, userId, progress, comment }); // Debug log

    // Validate inputs
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    // Verify status
    const validStatuses = ['pending', 'in-progress', 'completed', 'on-hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log('Task found:', task); // Debug log

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', { userId, role: user.role }); // Debug log

    // Authorization check
    if (user.role !== 'admin' && task.assignedTo.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this task' });
    }

    // Update task
    task.status = status;
    if (progress !== undefined) {
      task.progress = Number(progress) || 0; // Ensure valid number
    }
    await task.save();
    console.log('Task updated:', task); // Debug log

    // Create status update
    let statusUpdate;
    try {
      statusUpdate = new TaskStatusUpdate({
        taskId,
        userId,
        status,
        comment: comment || '',
      });
      await statusUpdate.save();
      console.log('Status update saved:', statusUpdate); // Debug log
    } catch (statusError) {
      console.error('Failed to save TaskStatusUpdate:', statusError); // Specific log
      return res.status(400).json({ message: 'Failed to save task status update', error: statusError.message });
    }

    res.status(200).json({ message: 'Task status updated', task, statusUpdate });
  } catch (error) {
    console.error('Error in updateTaskStatus:', error); // Detailed error log
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};

// Update task details
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, assignedTo, dueDate, priority, updatedAt: Date.now() },
      { new: true }
    ).populate('assignedTo', 'fname lname email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task (soft delete)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { isDeleted: true },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

// Restore a deleted task
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { isDeleted: false },
      { new: true }
    ).populate('assignedTo', 'fname lname email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task restored successfully', task });
  } catch (error) {
    console.error('Error in restoreTask:', error);
    res.status(500).json({ message: 'Error restoring task', error: error.message });
  }
};