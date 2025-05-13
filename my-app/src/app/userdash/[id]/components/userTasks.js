'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const UserTasks = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  // Use environment variable or fallback to correct backend URL
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Fetch tasks when userId is available
  useEffect(() => {
    if (userId) {
      fetchUserTasks();
    }
  }, [userId]);

  const fetchUserTasks = async () => {
    try {
      console.log(`Fetching tasks from: ${backendURL}/api/tasks/user/${userId}`); // Debug log
      const res = await axios.get(`${backendURL}/api/tasks/user/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setMessage('Failed to fetch tasks');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${backendURL}/api/tasks/${taskId}/status`, {
        status: newStatus,
        userId: session.user.id,
      });
      setMessage('Task status updated successfully');
      fetchUserTasks(); // Refresh task list
    } catch (err) {
      console.error('Failed to update task status:', err);
      setMessage(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // Handle loading and unauthenticated states
  if (status === 'loading') {
    return <p className="text-center">Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p className="text-center">Please log in to view your tasks.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      {message && (
        <p className={`mb-4 ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Priority: {task.priority}</p>
              <div className="mt-2">
                <label
                  htmlFor={`status-${task._id}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id={`status-${task._id}`}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTasks;