'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowUpDown, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Filter, User, Mail, Edit, Trash, RefreshCw } from 'lucide-react';

const EmployeeManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [deniedUsers, setDeniedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ fname: '', lname: '', email: '' });
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fname', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;
  
  const formRef = useRef(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, deletedRes, deniedRes] = await Promise.all([
        axios.get(`${backendURL}/api/pending-users`),
        axios.get(`${backendURL}/api/approved-users`),
        axios.get(`${backendURL}/api/deleted-users`),
        axios.get(`${backendURL}/api/denied-users`),
      ]);
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data);
      setDeletedUsers(deletedRes.data);
      setDeniedUsers(deniedRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load users. Please try again later.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      await axios.put(`${backendURL}/api/approve/${id}`); // Updated to match backend route
      const [pendingRes, approvedRes] = await Promise.all([
        axios.get(`${backendURL}/api/pending-users`),
        axios.get(`${backendURL}/api/approved-users`),
      ]);
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data);
      toast.success('User approved successfully', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Error approving user:', err);
      toast.error(err.response?.data?.message || 'Failed to approve user', { duration: 5000 });
    }
  };

  const denyUser = async (id) => {
    try {
      await axios.put(`${backendURL}/api/deny/${id}`); // Already correct
      const [pendingRes, deniedRes] = await Promise.all([
        axios.get(`${backendURL}/api/pending-users`),
        axios.get(`${backendURL}/api/denied-users`),
      ]);
      setPendingUsers(pendingRes.data);
      setDeniedUsers(deniedRes.data);
      toast.success('User denied successfully', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Error denying user:', err);
      toast.error(err.response?.data?.message || 'Failed to deny user', { duration: 5000 });
    }
  };

  const approveDeniedUser = async (id) => {
    try {
      await axios.put(`${backendURL}/api/approve-denied/${id}`); // Updated to match backend route
      const [deniedRes, approvedRes] = await Promise.all([
        axios.get(`${backendURL}/api/denied-users`),
        axios.get(`${backendURL}/api/approved-users`),
      ]);
      setDeniedUsers(deniedRes.data);
      setApprovedUsers(approvedRes.data);
      toast.success('User approved successfully', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Error approving denied user:', err);
      toast.error(err.response?.data?.message || 'Failed to approve denied user', { duration: 5000 });
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/employees/${id}`);
      const [approvedRes, deletedRes] = await Promise.all([
        axios.get(`${backendURL}/api/approved-users`),
        axios.get(`${backendURL}/api/deleted-users`),
      ]);
      setApprovedUsers(approvedRes.data);
      setDeletedUsers(deletedRes.data);
      toast.success('User moved to trash', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user', { duration: 5000 });
    }
  };

  const restoreUser = async (id) => {
    try {
      await axios.put(`${backendURL}/api/restore/${id}`); // Updated to match backend route
      const [deletedRes, approvedRes] = await Promise.all([
        axios.get(`${backendURL}/api/deleted-users`),
        axios.get(`${backendURL}/api/approved-users`),
      ]);
      setDeletedUsers(deletedRes.data);
      setApprovedUsers(approvedRes.data);
      toast.success('User restored successfully', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Error restoring user:', err);
      toast.error(err.response?.data?.message || 'Failed to restore user', { duration: 5000 });
    }
  };

  const startEdit = (user) => {
    setSelectedUser(user);
    setEditUserId(user._id);
    setEditForm({ fname: user.fname, lname: user.lname, email: user.email });
    
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendURL}/api/employees/${editUserId}`, editForm);
      setApprovedUsers(
        approvedUsers.map((user) =>
          user._id === editUserId ? { ...user, ...editForm } : user
        )
      );
      setEditUserId(null);
      setSelectedUser(null);
      toast.success('User updated successfully', { 
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
    } catch (err) {
      console.error('Error updating user:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to update user', { duration: 5000 });
    }
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setSelectedUser(null);
    setEditForm({ fname: '', lname: '', email: '' });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getTabColor = (tab) => {
    switch (tab) {
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'approved': return 'from-green-500 to-emerald-500';
      case 'denied': return 'from-red-500 to-rose-500';
      case 'deleted': return 'from-gray-500 to-gray-600';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const getSortedAndFilteredUsers = () => {
    let usersToShow = [];
    
    switch (activeTab) {
      case 'pending': usersToShow = [...pendingUsers]; break;
      case 'approved': usersToShow = [...approvedUsers]; break;
      case 'denied': usersToShow = [...deniedUsers]; break;
      case 'deleted': usersToShow = [...deletedUsers]; break;
      default: usersToShow = [];
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      usersToShow = usersToShow.filter(user => 
        user.fname.toLowerCase().includes(term) || 
        user.lname.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    return usersToShow.sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = `${a.fname} ${a.lname}`.toLowerCase();
        const nameB = `${b.fname} ${b.lname}`.toLowerCase();
        return sortConfig.direction === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      }
      
      const valueA = a[sortConfig.key]?.toLowerCase() || '';
      const valueB = b[sortConfig.key]?.toLowerCase() || '';
      
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getPaginatedData = () => {
    const sortedAndFiltered = getSortedAndFilteredUsers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      currentData: sortedAndFiltered.slice(startIndex, endIndex),
      totalPages: Math.ceil(sortedAndFiltered.length / itemsPerPage),
      totalItems: sortedAndFiltered.length
    };
  };

  const { currentData, totalPages, totalItems } = getPaginatedData();

  const renderUserList = (title) => (
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
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name or email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

      <div className="bg-white rounded-t-lg shadow overflow-hidden mb-4">
        <div className="grid grid-cols-12 p-4 border-b bg-gray-50 text-sm font-medium text-gray-700">
          <div className="col-span-4 md:col-span-3 flex items-center cursor-pointer" onClick={() => handleSort('name')}>
            <span>Name</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </div>
          <div className="col-span-6 md:col-span-4 flex items-center cursor-pointer" onClick={() => handleSort('email')}>
            <span>Email</span>
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </div>
          <div className="hidden md:flex md:col-span-3 items-center">
            <span>Status</span>
          </div>
          <div className="col-span-2 md:col-span-2 flex items-center justify-end">
            <span>Actions</span>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No {title.toLowerCase()} found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            <AnimatePresence>
              {currentData.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-4 md:col-span-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">{user.fname} {user.lname}</p>
                  </div>
                  <div className="col-span-6 md:col-span-4 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="hidden md:flex md:col-span-3 items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === 'approved' ? 'bg-green-100 text-green-800' :
                      activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activeTab === 'denied' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-2 flex items-center justify-end space-x-2">
                    {activeTab === 'pending' && (
                      <>
                        <button
                          onClick={() => approveUser(user._id)}
                          className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => denyUser(user._id)}
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          title="Deny"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {activeTab === 'approved' && (
                      <>
                        <button
                          onClick={() => startEdit(user)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                          title="Delete"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {activeTab === 'denied' && (
                      <button
                        onClick={() => approveDeniedUser(user._id)}
                        className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    {activeTab === 'deleted' && (
                      <button
                        onClick={() => restoreUser(user._id)}
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        title="Restore"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="col-span-12 md:hidden mt-2 flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === 'approved' ? 'bg-green-100 text-green-800' :
                      activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activeTab === 'denied' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{currentData.length}</span> of <span className="font-medium">{totalItems}</span> users
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-white">Employee Management</h1>
        <p className="text-purple-100 mt-2">Manage user accounts and access permissions</p>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4">
                <h3 className="text-xl font-semibold text-white">Edit User</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">User Details</p>
                  <p className="font-medium">{selectedUser.fname} {selectedUser.lname}</p>
                  <p className="text-gray-600 text-sm">{selectedUser.email}</p>
                </div>
                
                <form onSubmit={submitEdit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fname">First Name</label>
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      value={editForm.fname}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lname">Last Name</label>
                    <input
                      type="text"
                      id="lname"
                      name="lname"
                      value={editForm.lname}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors duration-200 shadow-sm"
                    >
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending', count: pendingUsers.length, icon: <Clock className="w-4 h-4 mr-1" /> },
            { id: 'approved', label: 'Approved', count: approvedUsers.length, icon: <CheckCircle className="w-4 h-4 mr-1" /> },
            { id: 'denied', label: 'Denied', count: deniedUsers.length, icon: <XCircle className="w-4 h-4 mr-1" /> },
            { id: 'deleted', label: 'Trash', count: deletedUsers.length, icon: <Trash className="w-4 h-4 mr-1" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
                setSearchTerm('');
              }}
              className={`relative px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
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

      <AnimatePresence mode="wait">
        <div key={activeTab} className="min-h-80">
          {activeTab === 'pending' && renderUserList('Pending Users')}
          {activeTab === 'approved' && renderUserList('Approved Users')}
          {activeTab === 'denied' && renderUserList('Denied Users')}
          {activeTab === 'deleted' && renderUserList('Deleted Users')}
        </div>
      </AnimatePresence>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        button {
          transition: all 0.2s ease-in-out;
        }
        
        button:hover {
          transform: translateY(-1px);
        }
        
        button:active {
          transform: translateY(1px);
        }
        
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
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EmployeeManagement;