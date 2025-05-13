'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leave() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    priority: 'low',
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [sortCriteria, setSortCriteria] = useState([
    { category: 'date', key: 'createdAt', direction: 'desc' },
  ]);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Fetch user's leave requests
  useEffect(() => {
    if (session?.user?.id) {
      const fetchLeaveRequests = async () => {
        try {
          const res = await axios.get(`${backendURL}/api/leaves/user/${session.user.id}`);
          setLeaveRequests(res.data);
        } catch (err) {
          console.error('Error fetching leave requests:', err);
          toast.error('Failed to fetch leave requests');
        }
      };
      fetchLeaveRequests();
    }
  }, [session]);

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

  // Handle sorting
  const handleSort = (category, key, direction) => {
    setSortCriteria((prevCriteria) => {
      const existingIndex = prevCriteria.findIndex((crit) => crit.category === category);
      const newCriterion = { category, key, direction };

      if (existingIndex !== -1) {
        if (prevCriteria[existingIndex].key === key && prevCriteria[existingIndex].direction === direction) {
          const newDirection = direction === 'asc' ? 'desc' : 'asc';
          const updatedCriteria = [...prevCriteria];
          updatedCriteria[existingIndex] = { category, key, direction: newDirection };
          return updatedCriteria;
        }
        const updatedCriteria = [...prevCriteria];
        updatedCriteria[existingIndex] = newCriterion;
        return updatedCriteria;
      }
      return [...prevCriteria, newCriterion];
    });
  };

  // Sort leave requests
  const sortedLeaveRequests = [...leaveRequests].sort((a, b) => {
    for (const { key, direction } of sortCriteria) {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'createdAt' || key === 'startDate' || key === 'endDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'approved': return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const getPriorityColor = () => {
      switch (priority) {
        case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'high': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor()} border`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Custom dropdown component
  const SortDropdown = ({ label, options, category, currentCriteria }) => {
    const current = currentCriteria.find((crit) => crit.category === category) || options[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="relative w-28"
      >
        <select
          onChange={(e) => {
            const [key, direction] = e.target.value.split('-');
            handleSort(category, key, direction);
          }}
          value={`${current.key}-${current.direction}`}
          className="w-full px-2 py-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-200 transition duration-200 appearance-none shadow-sm"
          aria-label={`Sort by ${label}`}
        >
          {options.map((option) => (
            <option key={`${option.key}-${option.direction}`} value={`${option.key}-${option.direction}`}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                You must be logged in to view this page. Please log in to continue.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sorting options for each dropdown
  const dateSortOptions = [
    { label: 'Created (Newest)', key: 'createdAt', direction: 'desc' },
    { label: 'Created (Oldest)', key: 'createdAt', direction: 'asc' },
    { label: 'Start (Latest)', key: 'startDate', direction: 'desc' },
    { label: 'Start (Earliest)', key: 'startDate', direction: 'asc' },
    { label: 'End (Latest)', key: 'endDate', direction: 'desc' },
    { label: 'End (Earliest)', key: 'endDate', direction: 'asc' },
  ];

  const statusSortOptions = [
    { label: 'Status (A-Z)', key: 'status', direction: 'asc' },
    { label: 'Status (Z-A)', key: 'status', direction: 'desc' },
  ];

  const prioritySortOptions = [
    { label: 'Priority (Low-High)', key: 'priority', direction: 'asc' },
    { label: 'Priority (High-Low)', key: 'priority', direction: 'desc' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Leave Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Request Leave
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reason">
                Reason for Leave
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 resize-none"
                rows="4"
                placeholder="Please describe your reason for requesting leave..."
                required
                aria-required="true"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="endDate">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="priority">
                Priority Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                </div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 appearance-none"
                  required
                  aria-required="true"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition duration-200"
            >
              Submit Leave Request
            </motion.button>
          </form>
        </motion.div>

        {/* Right column: Leave Request History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Your Leave Requests
            </h2>
            <div className="flex flex-wrap gap-2">
              <SortDropdown
                label="Date"
                options={dateSortOptions}
                category="date"
                currentCriteria={sortCriteria}
              />
              <SortDropdown
                label="Status"
                options={statusSortOptions}
                category="status"
                currentCriteria={sortCriteria}
              />
              <SortDropdown
                label="Priority"
                options={prioritySortOptions}
                category="priority"
                currentCriteria={sortCriteria}
              />
            </div>
          </div>

          {sortedLeaveRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 18v-6M9 15h6" />
              </svg>
              <p className="text-gray-500 text-lg">No leave requests submitted yet.</p>
              <p className="text-gray-400 text-sm mt-2">Your leave request history will appear here.</p>
            </motion.div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-96 pr-2">
              <AnimatePresence>
                {sortedLeaveRequests.map((request) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <div className="mb-2">
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={request.status} />
                          <PriorityBadge priority={request.priority} />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3 border-l-4 border-gray-200 pl-3">
                      {request.reason}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="font-semibold">From:</span> {new Date(request.startDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold">To:</span> {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    {request.adminComment && (
                      <div className="mt-3 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                        <p className="text-xs font-medium text-gray-500 mb-1">Admin Comment:</p>
                        <p className="text-sm text-gray-700">{request.adminComment}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}