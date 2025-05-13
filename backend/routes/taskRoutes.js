//routes/taskRoutes.js
import express from 'express';
import {
  createTask,
  getAllTasks,
  getUserTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getCompletedTasks,
  getDeletedTasks,
  restoreTask,
} from '../controllers/taskController.js';

const router = express.Router();

// Task management routes
router.post('/', createTask); // Create a new task
router.get('/', getAllTasks); // Get all active tasks
router.get('/completed', getCompletedTasks); // Get completed tasks
router.get('/deleted', getDeletedTasks); // Get deleted tasks
router.get('/user/:userId', getUserTasks); // Get tasks for a specific user
router.put('/:taskId/status', updateTaskStatus); // Update task status
router.put('/:taskId', updateTask); // Update task details
router.delete('/:taskId', deleteTask); // Soft delete a task
router.put('/:taskId/restore', restoreTask); // Restore a deleted task

export default router;