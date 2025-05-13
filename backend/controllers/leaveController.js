import mongoose from 'mongoose';
import LeaveRequest from '../models/leaveRequest.js';
import User from '../models/user.js';

// Create a leave request (User)
export const createLeaveRequest = async (req, res) => {
  try {
    const { reason, startDate, endDate, priority } = req.body;
    const userId = req.body.userId;

    console.log('Create leave request:', { userId, reason, startDate, endDate, priority });

    // Validate inputs
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!reason || !startDate || !endDate || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create leave request
    const leaveRequest = new LeaveRequest({
      userId,
      reason,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      priority,
    });

    await leaveRequest.save();
    res.status(201).json({ message: 'Leave request submitted', leaveRequest });
  } catch (error) {
    console.error('Error in createLeaveRequest:', error);
    res.status(500).json({ message: 'Error submitting leave request', error: error.message });
  }
};

// Get user's leave requests
export const getUserLeaveRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const leaveRequests = await LeaveRequest.find({ userId })
      .populate('userId', 'fname lname email')
      .sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error in getUserLeaveRequests:', error);
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
};

// Get pending leave requests (Admin)
export const getPendingLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({
      status: { $in: ['yet to be checked', 'under consideration'] },
    })
      .populate('userId', 'fname lname email')
      .sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error in getPendingLeaveRequests:', error);
    res.status(500).json({ message: 'Error fetching pending leave requests', error: error.message });
  }
};

// Get approved leave requests (Admin)
export const getApprovedLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ status: 'approved' })
      .populate('userId', 'fname lname email')
      .sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error in getApprovedLeaveRequests:', error);
    res.status(500).json({ message: 'Error fetching approved leave requests', error: error.message });
  }
};

// Get denied leave requests (Admin)
export const getDeniedLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ status: 'denied' })
      .populate('userId', 'fname lname email')
      .sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error in getDeniedLeaveRequests:', error);
    res.status(500).json({ message: 'Error fetching denied leave requests', error: error.message });
  }
};

// Update leave request status (Admin)
export const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const leaveRequestId = req.params.leaveRequestId;

    console.log('Update leave request:', { leaveRequestId, status, adminComment });

    // Validate inputs
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    if (!mongoose.isValidObjectId(leaveRequestId)) {
      return res.status(400).json({ message: 'Invalid leave request ID' });
    }

    // Verify status
    const validStatuses = ['yet to be checked', 'under consideration', 'approved', 'denied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Find leave request
    const leaveRequest = await LeaveRequest.findById(leaveRequestId);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update status and comment
    leaveRequest.status = status;
    if (adminComment) {
      leaveRequest.adminComment = adminComment;
    }
    await leaveRequest.save();

    res.status(200).json({ message: 'Leave request updated', leaveRequest });
  } catch (error) {
    console.error('Error in updateLeaveRequestStatus:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Error updating leave request', error: error.message });
  }
};