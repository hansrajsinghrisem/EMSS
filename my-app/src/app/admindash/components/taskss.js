'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

export default function AssignTaskPage() {
  const [users, setUsers] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
  });
  const [message, setMessage] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [sortOptions, setSortOptions] = useState({
    active: { sortBy: 'dueDate', sortOrder: 'asc' },
    completed: { sortBy: 'dueDate', sortOrder: 'asc' },
    deleted: { sortBy: 'dueDate', sortOrder: 'asc' },
  });
  const [activeTab, setActiveTab] = useState('active');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const formRef = useRef(null);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('https://emss-wtii.onrender.com/api/approved-users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      // Fetch active tasks
      const activeRes = await axios.get('https://emss-wtii.onrender.com/api/tasks', {
        params: {
          sortBy: sortOptions.active.sortBy,
          sortOrder: sortOptions.active.sortOrder,
        },
      });
      setActiveTasks(activeRes.data);

      // Fetch completed tasks
      const completedRes = await axios.get('https://emss-wtii.onrender.com/api/tasks/completed', {
        params: {
          sortBy: sortOptions.completed.sortBy,
          sortOrder: sortOptions.completed.sortOrder,
        },
      });
      setCompletedTasks(completedRes.data);

      // Fetch deleted tasks
      const deletedRes = await axios.get('https://emss-wtii.onrender.com/api/tasks/deleted', {
        params: {
          sortBy: sortOptions.deleted.sortBy,
          sortOrder: sortOptions.deleted.sortOrder,
        },
      });
      setDeletedTasks(deletedRes.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, [sortOptions]);

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, [fetchUsers, fetchTasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTaskId) {
        await axios.put(`https://emss-wtii.onrender.com/api/tasks/${editTaskId}`, form);
        setMessage('Task updated successfully');
        setIsEditMode(false);
      } else {
        await axios.post('https://emss-wtii.onrender.com/api/tasks', {
          ...form,
          createdBy: adminId,
        });
        setMessage('Task created successfully');
      }
      setForm({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
      });
      setEditTaskId(null);
      fetchTasks();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error submitting task:', err);
      setMessage('Failed to submit task');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || '',
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
    });
    setEditTaskId(task._id);
    setIsEditMode(true);
    
    // Scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://emss-wtii.onrender.com/api/tasks/${id}`);
      setMessage('Task moved to trash');
      fetchTasks();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      setMessage('Failed to delete task');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleComplete = async (task) => {
    try {
      await axios.put(`https://emss-wtii.onrender.com/api/tasks/${task._id}/status`, {
        status: task.status === 'completed' ? 'pending' : 'completed',
        userId: adminId,
      });
      setMessage(task.status === 'completed' ? 'Task marked as pending' : 'Task marked as completed');
      fetchTasks();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to update task status:', err);
      setMessage('Failed to update task status');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`https://emss-wtii.onrender.com/api/tasks/${id}/restore`);
      setMessage('Task restored successfully');
      fetchTasks();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to restore task:', err);
      setMessage('Failed to restore task');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleSortChange = (listType, sortBy, sortOrder) => {
    setSortOptions((prev) => ({
      ...prev,
      [listType]: { sortBy, sortOrder },
    }));
  };

  const cancelEdit = () => {
    setForm({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
    });
    setEditTaskId(null);
    setIsEditMode(false);
  };

  // Priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate if a task is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() ? 'text-red-600 font-medium' : '';
  };

  const renderTaskList = (tasks, listType) => (
    <div className={`${activeTab === listType ? 'block animate-fadeIn' : 'hidden'} space-y-6`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">
          {listType === 'active' && 'Active Tasks'}
          {listType === 'completed' && 'Completed Tasks'}
          {listType === 'deleted' && 'Deleted Tasks'}
          <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            onChange={(e) => handleSortChange(listType, e.target.value, sortOptions[listType].sortOrder)}
            value={sortOptions[listType].sortBy}
            className="border border-gray-300 p-2 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
          >
            <option value="title">Sort by Title</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
          <select
            onChange={(e) => handleSortChange(listType, sortOptions[listType].sortBy, e.target.value)}
            value={sortOptions[listType].sortOrder}
            className="border border-gray-300 p-2 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-800 truncate mr-2" title={task.title}>
                    {task.title}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2" title={task.description}>
                  {task.description}
                </p>
                
                <div className="flex flex-col space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>
                      {task.assignedTo && task.assignedTo.fname
                        ? `${task.assignedTo.fname} ${task.assignedTo.lname || ''}`
                        : 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className={isOverdue(task.dueDate)}>
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  {listType === 'deleted' ? (
                    <button
                      onClick={() => handleRestore(task._id)}
                      className="px-3 py-1.5 text-sm text-white rounded bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      Restore
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-1.5 text-sm text-white rounded bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="px-3 py-1.5 text-sm text-white rounded bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div 
            ref={formRef} 
            className={`p-6 bg-gradient-to-r from-purple-50 to-blue-50 transition-all duration-500 ease-in-out ${isEditMode ? 'border-l-4 border-purple-500' : ''}`}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6 transition-all duration-300">
              {editTaskId ? 'Edit Task' : 'Create New Task'}
              {isEditMode && <span className="text-sm font-normal ml-2 text-purple-600">Editing task</span>}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.fname} {user.lname} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows="3"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-300 ease-in-out hover:border-indigo-300"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                {editTaskId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="mr-3 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {editTaskId ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>

          {message && (
            <div className="bg-green-50 border-t border-b border-green-200 px-4 py-3 text-center animate-fadeIn">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
          )}

          <div className="p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`pb-4 px-1 font-medium text-sm transition-all duration-300 ease-in-out ${
                    activeTab === 'active'
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Active
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {activeTasks.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`pb-4 px-1 font-medium text-sm transition-all duration-300 ease-in-out ${
                    activeTab === 'completed'
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Completed
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {completedTasks.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('deleted')}
                  className={`pb-4 px-1 font-medium text-sm transition-all duration-300 ease-in-out ${
                    activeTab === 'deleted'
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Trash
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {deletedTasks.length}
                  </span>
                </button>
              </nav>
            </div>

            {renderTaskList(activeTasks, 'active')}
            {renderTaskList(completedTasks, 'completed')}
            {renderTaskList(deletedTasks, 'deleted')}
          </div>
        </div>
      </div>
    </div>
  );
}