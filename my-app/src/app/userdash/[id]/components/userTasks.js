'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Tasks() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortByDate, setSortByDate] = useState('desc');
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Fetch tasks when userId is available
  const fetchUserTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/tasks/user/${userId}`);
      setTasks(res.data);
      setMessage('');
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setMessage('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [userId, backendURL]);

  useEffect(() => {
    if (userId) {
      fetchUserTasks();
    }
  }, [userId, fetchUserTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${backendURL}/api/tasks/${taskId}/status`, {
        status: newStatus,
        userId: session.user.id,
      });
      
      // Optimistic update
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Show success message with auto-dismiss
      setMessage('Task status updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update task status:', err);
      setMessage(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // Filter and sort tasks
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Handle loading and unauthenticated states
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 bg-red-50 rounded-lg shadow-md"
      >
        <p className="text-red-500 font-medium">Please log in to view your tasks.</p>
        <button 
          className="mt-4 px-6 py-2 rounded-md bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium transform transition hover:scale-105"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
            
            <select
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mb-4 p-3 rounded-md ${message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
        >
          {message.includes('Failed') ? (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          ) : (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {message}
            </div>
          )}
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12 bg-gray-50 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-2 text-gray-600">
            {filter === 'all' ? 'No tasks assigned to you yet.' : `No ${filter} tasks found.`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {sortedTasks.map((task, index) => (
            <motion.div 
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' :
                task.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                task.status === 'on-hold' ? 'bg-yellow-50 border-yellow-200' :
                'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold line-clamp-1">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
              
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">{task.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-4">
                <label
                  htmlFor={`status-${task._id}`}
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Update Status
                </label>
                <select
                  id={`status-${task._id}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}