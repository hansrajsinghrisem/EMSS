'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Overview = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    onHoldTasks: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    deniedLeaves: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Fetch stats for tasks and leaves
  const fetchStats = useCallback(async () => {
    if (userId) {
      try {
        const [tasksRes, leavesRes] = await Promise.all([
          axios.get(`${backendURL}/api/tasks/user/${userId}`),
          axios.get(`${backendURL}/api/leaves/user/${userId}`),
        ]);
        const tasks = tasksRes.data;
        const leaves = leavesRes.data;

        setStats({
          totalTasks: tasks.length,
          pendingTasks: tasks.filter(t => t.status === 'pending').length,
          inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
          completedTasks: tasks.filter(t => t.status === 'completed').length,
          onHoldTasks: tasks.filter(t => t.status === 'on-hold').length,
          totalLeaves: leaves.length,
          pendingLeaves: leaves.filter(l => l.status === 'Pending').length,
          approvedLeaves: leaves.filter(l => l.status === 'Approved').length,
          deniedLeaves: leaves.filter(l => l.status === 'Denied').length,
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch overview stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        toast.error('Failed to load dashboard data', { duration: 5000 });
      }
    }
  }, [userId, backendURL]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const buttonClasses =
    'inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg w-full';

  const cardClasses =
    'bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-opacity-90 backdrop-blur-sm flex flex-col items-center text-center';

  const sectionClasses = 
    'mb-10 animate-fadeIn';
    
  const sectionHeaderClasses =
    'text-2xl font-bold mb-6 text-gray-800 border-b-2 border-indigo-500 pb-2 inline-block';

  if (status === 'loading' || loading) {
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-600 animate-pulse">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-20">
        <div className="bg-red-100 p-6 rounded-lg max-w-md mx-auto shadow-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p className="text-lg font-medium text-red-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-yellow-50 p-6 rounded-lg max-w-md mx-auto shadow-md">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight relative inline-block">
          {session?.user?.fname} Dashboard
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </h1>
        <p className="text-gray-600 mt-2">View and manage your tasks and leave requests</p>
      </div>

      {/* Tasks Section */}
      <div className={sectionClasses}>
        <div className="flex justify-center mb-6">
          <h2 className={sectionHeaderClasses}>
            <svg className="w-6 h-6 inline-block mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Task Summary
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-12">
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h2>
            <p className="text-3xl font-bold text-blue-600 mb-4">{stats.totalTasks}</p>
            <Link href={`/userdash/${userId}/tasks`} className={buttonClasses}>
              View All Tasks
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Tasks</h2>
            <p className="text-3xl font-bold text-yellow-600 mb-4">{stats.pendingTasks}</p>
            <Link href={`/userdash/${userId}/tasks`} className={buttonClasses}>
              View Pending
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">In Progress</h2>
            <p className="text-3xl font-bold text-indigo-600 mb-4">{stats.inProgressTasks}</p>
            <Link href={`/userdash/${userId}/tasks`} className={buttonClasses}>
              View In Progress
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Completed</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">{stats.completedTasks}</p>
            <Link href={`/userdash/${userId}/tasks`} className={buttonClasses}>
              View Completed
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">On Hold</h2>
            <p className="text-3xl font-bold text-gray-600 mb-4">{stats.onHoldTasks}</p>
            <Link href={`/userdash/${userId}/tasks`} className={buttonClasses}>
              View On Hold
            </Link>
          </div>
        </div>
      </div>

      {/* Leave Section */}
      <div className={sectionClasses}>
        <div className="flex justify-center mb-6">
          <h2 className={sectionHeaderClasses}>
            <svg className="w-6 h-6 inline-block mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Leave Requests
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Leaves</h2>
            <p className="text-3xl font-bold text-blue-600 mb-4">{stats.totalLeaves}</p>
            <Link href={`/userdash/${userId}/leave`} className={buttonClasses}>
              View All Leaves
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Leaves</h2>
            <p className="text-3xl font-bold text-yellow-600 mb-4">{stats.pendingLeaves}</p>
            <Link href={`/userdash/${userId}/leave`} className={buttonClasses}>
              View Pending
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Approved Leaves</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">{stats.approvedLeaves}</p>
            <Link href={`/userdash/${userId}/leave`} className={buttonClasses}>
              View Approved
            </Link>
          </div>

          <div className={cardClasses}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Denied Leaves</h2>
            <p className="text-3xl font-bold text-red-600 mb-4">{stats.deniedLeaves}</p>
            <Link href={`/userdash/${userId}/leave`} className={buttonClasses}>
              View Denied
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm bg-opacity-90 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/userdash/${userId}/tasks`} className={`${buttonClasses} max-w-xs`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            View My Tasks
          </Link>
          <Link href={`/userdash/${userId}/leave`} className={`${buttonClasses} max-w-xs`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Request Leave
          </Link>
          <button
            onClick={() => toast.info('Feature coming soon!', { duration: 3000 })}
            className={`${buttonClasses} max-w-xs`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Update Profile
          </button>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Overview;