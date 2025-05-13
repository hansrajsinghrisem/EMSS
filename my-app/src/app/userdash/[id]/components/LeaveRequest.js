'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LeaveRequest = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    priority: 'low',
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Fetch user's leave requests
  const fetchLeaveRequests = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const res = await axios.get(`${backendURL}/api/leaves/user/${session.user.id}`);
        setLeaveRequests(res.data);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        toast.error('Failed to fetch leave requests');
      }
    }
  }, [session, backendURL]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/leaves`, {
        ...formData,
        userId: session.user.id,
      });
      toast.success('Leave request submitted', { duration: 3000 });
      setLeaveRequests([res.data.leaveRequest, ...leaveRequests]);
      setFormData({ reason: '', startDate: '', endDate: '', priority: 'low' });
    } catch (err) {
      console.error('Error submitting leave request:', err);
      toast.error(err.response?.data?.message || 'Failed to submit leave request', { duration: 5000 });
    }
  };

  if (status === 'loading') return <p className="text-center text-gray-500">Loading...</p>;
  if (!session?.user) {
    return <p className="text-center text-red-500">You must be logged in to view this page.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Leave Request</h1>

      {/* Leave Request Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Submit a Leave Request</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="reason">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="priority">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>

      {/* Leave Requests List */}
      <h2 className="text-2xl font-semibold mb-4">Your Leave Requests</h2>
      {leaveRequests.length === 0 ? (
        <p className="text-gray-500">No leave requests submitted.</p>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <div
              key={request._id}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <p><strong>Reason:</strong> {request.reason}</p>
              <p><strong>Start Date:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
              <p><strong>Priority:</strong> {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}</p>
              <p><strong>Status:</strong> {request.status.replace(/^\w/, (c) => c.toUpperCase())}</p>
              {request.adminComment && (
                <p><strong>Admin Comment:</strong> {request.adminComment}</p>
              )}
              <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;