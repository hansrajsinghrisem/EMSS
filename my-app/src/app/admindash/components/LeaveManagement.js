'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowUpDown, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeaveManagement = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [deniedRequests, setDeniedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', adminComment: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });
  const [filterConfig, setFilterConfig] = useState({ priority: '', searchTerm: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    if (session?.user?.role === 'admin') {
      try {
        const [pendingRes, approvedRes, deniedRes] = await Promise.all([
          axios.get(`${backendURL}/api/leaves/pending`),
          axios.get(`${backendURL}/api/leaves/approved`),
          axios.get(`${backendURL}/api/leaves/denied`)
        ]);
        
        setPendingRequests(pendingRes.data);
        setApprovedRequests(approvedRes.data);
        setDeniedRequests(deniedRes.data);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        toast.error('Failed to fetch leave requests');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchLeaveRequests();
    }
  }, [session]);

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${backendURL}/api/leaves/${selectedRequest._id}/status`, updateForm);
      toast.success('Leave request updated successfully', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
      
      const updatedRequest = res.data.leaveRequest;
      if (updatedRequest.status === 'approved') {
        setApprovedRequests((prev) => [updatedRequest, ...prev.filter((req) => req._id !== updatedRequest._id)]);
        setPendingRequests((prev) => prev.filter((req) => req._id !== updatedRequest._id));
        setDeniedRequests((prev) => prev.filter((req) => req._id !== updatedRequest._id));
      } else if (updatedRequest.status === 'denied') {
        setDeniedRequests((prev) => [updatedRequest, ...prev.filter((req) => req._id !== updatedRequest._id)]);
        setPendingRequests((prev) => prev.filter((req) => req._id !== updatedRequest._id));
        setApprovedRequests((prev) => prev.filter((req) => req._id !== updatedRequest._id));
      } else {
        setPendingRequests((prev) => [updatedRequest, ...prev.filter((req) => req._id !== updatedRequest._id)]);
        setApprovedRequests((prev) => prev.filter((req) => req._id !== updatedRequest._id));
        setDeniedRequests((prev) => prev.filter((req) => req._id !== updatedRequest._id));
      }
      setSelectedRequest(null);
      setUpdateForm({ status: '', adminComment: '' });
    } catch (err) {
      console.error('Error updating leave request:', err);
      toast.error(err.response?.data?.message || 'Failed to update leave request', { duration: 5000 });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'denied':
        return <XCircle className="text-red-500 w-5 h-5" />;
      case 'under consideration':
        return <Clock className="text-yellow-500 w-5 h-5" />;
      default:
        return <AlertCircle className="text-gray-500 w-5 h-5" />;
    }
  };

  const getSortedAndFilteredRequests = useMemo(() => {
    let requestsToShow = [];
    
    if (activeTab === 'pending') requestsToShow = [...pendingRequests];
    else if (activeTab === 'approved') requestsToShow = [...approvedRequests];
    else if (activeTab === 'denied') requestsToShow = [...deniedRequests];
    
    // Apply filters
    if (filterConfig.priority) {
      requestsToShow = requestsToShow.filter(req => req.priority === filterConfig.priority);
    }
    
    if (filterConfig.searchTerm) {
      const searchTerm = filterConfig.searchTerm.toLowerCase();
      requestsToShow = requestsToShow.filter(req => 
        (req.userId.fname + ' ' + req.userId.lname).toLowerCase().includes(searchTerm) ||
        req.reason.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    return requestsToShow.sort((a, b) => {
      if (sortConfig.key === 'userName') {
        const fullNameA = `${a.userId.fname} ${a.userId.lname}`;
        const fullNameB = `${b.userId.fname} ${b.userId.lname}`;
        return sortConfig.direction === 'asc' 
          ? fullNameA.localeCompare(fullNameB)
          : fullNameB.localeCompare(fullNameA);
      }
      
      if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });
  }, [activeTab, pendingRequests, approvedRequests, deniedRequests, sortConfig, filterConfig]);

  const handleFilterChange = (e) => {
    setFilterConfig({ ...filterConfig, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilterConfig({ priority: '', searchTerm: '' });
  };

  const getTabColor = (tab) => {
    switch (tab) {
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'approved': return 'from-green-500 to-emerald-500';
      case 'denied': return 'from-red-500 to-rose-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const renderRequestList = (requests, title) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          <Filter className="w-5 h-5 mr-2" />
          <span>Filters</span>
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  name="searchTerm"
                  value={filterConfig.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search by name or reason"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={filterConfig.priority}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Headers for Sorting */}
      <div className="bg-white rounded-t-lg shadow overflow-hidden mb-4">
        <div className="grid grid-cols-12 p-4 border-b bg-gray-50 text-sm font-medium text-gray-700">
          <div className="col-span-3 md:col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('userName')}>
            <span>User</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-3 md:col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('startDate')}>
            <span>Start Date</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-3 md:col-span-2 flex items-center cursor-pointer" onClick={() => handleSort('endDate')}>
            <span>End Date</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </div>
          <div className="hidden md:flex md:col-span-3 items-center">
            <span>Reason</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center cursor-pointer" onClick={() => handleSort('priority')}>
            <span>Priority</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-1 md:col-span-1 flex items-center">
            <span>Status</span>
          </div>
          <div className="col-span-0 md:col-span-1"></div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No {title.toLowerCase()} found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {getSortedAndFilteredRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-3 md:col-span-2">
                    <p className="font-medium">{request.userId.fname} {request.userId.lname}</p>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{formatDate(request.startDate)}</span>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{formatDate(request.endDate)}</span>
                  </div>
                  <div className="hidden md:block md:col-span-3 truncate">
                    <span className="tooltip" title={request.reason}>{request.reason}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-1 md:col-span-1 flex items-center">
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="col-span-12 md:col-span-1 mt-2 md:mt-0 flex justify-end">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                    >
                      Update
                    </button>
                  </div>
                  {/* Mobile view: Show reason on expanded row */}
                  <div className="col-span-12 md:hidden mt-2 text-sm text-gray-600">
                    <strong>Reason:</strong> {request.reason}
                  </div>
                  {request.adminComment && (
                    <div className="col-span-12 mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Admin Comment:</strong> {request.adminComment}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-500 text-xl font-semibold">Access Denied</p>
        <p className="text-gray-600 mt-2">You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header with gradient background */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-white">Leave Management</h1>
        <p className="text-blue-100 mt-2">Manage employee leave requests efficiently</p>
      </div>

      {/* Tabs with animations */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-gray-200">
          {[
            { id: 'pending', label: 'Pending', count: pendingRequests.length },
            { id: 'approved', label: 'Approved', count: approvedRequests.length },
            { id: 'denied', label: 'Denied', count: deniedRequests.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getTabColor(tab.id)}`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <AnimatePresence mode="wait">
        <div key={activeTab} className="min-h-80">
          {activeTab === 'pending' && renderRequestList(pendingRequests, 'Pending Leave Requests')}
          {activeTab === 'approved' && renderRequestList(approvedRequests, 'Approved Leave Requests')}
          {activeTab === 'denied' && renderRequestList(deniedRequests, 'Denied Leave Requests')}
        </div>
      </AnimatePresence>

      {/* Modal for updating leave status */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"

          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
                <h3 className="text-xl font-semibold text-white">Update Leave Request</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Request from</p>
                  <p className="font-medium">{selectedRequest.userId.fname} {selectedRequest.userId.lname}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">From</p>
                      <p>{formatDate(selectedRequest.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To</p>
                      <p>{formatDate(selectedRequest.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Priority</p>
                      <p className="capitalize">{selectedRequest.priority}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-500">Reason</p>
                  <p>{selectedRequest.reason}</p>
                </div>
                
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">Status</label>
                    <select
                      name="status"
                      value={updateForm.status}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="yet to be checked">Yet to be Checked</option>
                      <option value="under consideration">Under Consideration</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="adminComment">Admin Comment</label>
                    <textarea
                      name="adminComment"
                      value={updateForm.adminComment}
                      onChange={handleUpdateChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      rows="4"
                      placeholder="Add your comments here..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add CSS for tooltips */}
      <style jsx global>{`
        .tooltip {
          position: relative;
          display: inline-block;
          cursor: default;
        }
        
        .tooltip:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          white-space: nowrap;
          font-size: 12px;
          z-index: 100;
        }
      `}</style>
    </div>
  );
};

export default LeaveManagement;