import express from 'express';
import {
  createLeaveRequest,
  getUserLeaveRequests,
  getPendingLeaveRequests,
  getApprovedLeaveRequests, // Added
  getDeniedLeaveRequests, // Added
  updateLeaveRequestStatus,
} from '../controllers/leaveController.js';

const router = express.Router();

// User routes
router.post('/leaves', createLeaveRequest);
router.get('/leaves/user/:userId', getUserLeaveRequests);

// Admin routes
router.get('/leaves/pending', getPendingLeaveRequests);
router.get('/leaves/approved', getApprovedLeaveRequests); // Added
router.get('/leaves/denied', getDeniedLeaveRequests); // Added
router.put('/leaves/:leaveRequestId/status', updateLeaveRequestStatus);

export default router;