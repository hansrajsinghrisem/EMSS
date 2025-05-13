'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Overvieww = () => {
  const { data: session, status } = useSession();
  const [counts, setCounts] = useState({
    pendingUsers: 0,
    approvedUsers: 0,
    deniedUsers: 0,
    deletedUsers: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    deniedLeaves: 0,
    activeTasks: 0,
    completedTasks: 0,
    deletedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      const fetchCounts = async () => {
        try {
          const [
            pendingUsersRes,
            approvedUsersRes,
            deniedUsersRes,
            deletedUsersRes,
            pendingLeavesRes,
            approvedLeavesRes,
            deniedLeavesRes,
            activeTasksRes,
            completedTasksRes,
            deletedTasksRes,
          ] = await Promise.all([
            axios.get('https://ems-backend-nkom.onrender.com/api/approved-users'),
            axios.get('https://ems-backend-nkom.onrender.com/api/denied-users'),
            axios.get('https://ems-backend-nkom.onrender.com/api/pending-users'),
            axios.get('https://ems-backend-nkom.onrender.com/api/deleted-users'),
            axios.get('https://ems-backend-nkom.onrender.com/api/leaves/pending'),
            axios.get('https://ems-backend-nkom.onrender.com/api/leaves/approved'),
            axios.get('https://ems-backend-nkom.onrender.com/api/leaves/denied'),
            axios.get('https://ems-backend-nkom.onrender.com/api/tasks'),
            axios.get('https://ems-backend-nkom.onrender.com/api/tasks/completed'),
            axios.get('https://ems-backend-nkom.onrender.com/api/tasks/deleted'),
          ]);
          setCounts({
            pendingUsers: pendingUsersRes.data.length,
            approvedUsers: approvedUsersRes.data.length,
            deniedUsers: deniedUsersRes.data.length,
            deletedUsers: deletedUsersRes.data.length,
            pendingLeaves: pendingLeavesRes.data.length,
            approvedLeaves: approvedLeavesRes.data.length,
            deniedLeaves: deniedLeavesRes.data.length,
            activeTasks: activeTasksRes.data.length,
            completedTasks: completedTasksRes.data.length,
            deletedTasks: deletedTasksRes.data.length,
          });
          setLoading(false);
        } catch (error) {
          console.error('Error fetching counts:', error);
          setError('Failed to load dashboard data. Please try again later.');
          setLoading(false);
          toast.error('Failed to load dashboard data', { duration: 5000 });
        }
      };
      fetchCounts();
    }
  }, [session]);

  const buttonClasses =
    'inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg w-full';

  const cardClasses =
    'bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-opacity-90 backdrop-blur-sm flex flex-col items-center text-center';

  const sectionClasses = 
    'mb-10 animate-fadeIn';
    
  const sectionHeaderClasses =
    'text-2xl font-bold mb-6 text-gray-800 border-b-2 border-indigo-500 pb-2 inline-block';

  if (status === 'loading') {
    return (
      <div className="text-center py-20 text-lg font-medium text-gray-600 animate-pulse">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (!session?.user || session.user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <div className="bg-red-100 p-6 rounded-lg max-w-md mx-auto shadow-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p className="text-lg font-medium text-red-600">You are not authorized to view this page.</p>
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
          Admin Dashboard Overview
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </h1>
        <p className="text-gray-600 mt-2">Manage your organization efficiently</p>
      </div>

      {/* User Management Section */}
      <div className={sectionClasses}>
        <div className="flex justify-center mb-6">
          <h2 className={sectionHeaderClasses}>
            <svg className="w-6 h-6 inline-block mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            User Management
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Users</h2>
            <p className="text-3xl font-bold text-indigo-600 mb-4">{counts.pendingUsers}</p>
            <Link href="/admindash/employeemanagement" className={buttonClasses}>
              Manage Pending
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Approved Users</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">{counts.approvedUsers}</p>
            <Link href="/admindash/employeemanagement" className={buttonClasses}>
              Manage Approved
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Denied Users</h2>
            <p className="text-3xl font-bold text-red-600 mb-4">{counts.deniedUsers}</p>
            <Link href="/admindash/employeemanagement" className={buttonClasses}>
              Manage Denied
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Deleted Users</h2>
            <p className="text-3xl font-bold text-gray-600 mb-4">{counts.deletedUsers}</p>
            <Link href="/admindash/employeemanagement" className={buttonClasses}>
              Manage Deleted
            </Link>
          </div>
        </div>
      </div>

      {/* Leave Management Section */}
      <div className={sectionClasses}>
        <div className="flex justify-center mb-6">
          <h2 className={sectionHeaderClasses}>
            <svg className="w-6 h-6 inline-block mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Leave Management
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Leaves</h2>
            <p className="text-3xl font-bold text-yellow-600 mb-4">{counts.pendingLeaves}</p>
            <Link href="/admindash/leaves" className={buttonClasses}>
              Manage Leaves
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Approved Leaves</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">{counts.approvedLeaves}</p>
            <Link href="/admindash/leaves" className={buttonClasses}>
              Manage Leaves
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Denied Leaves</h2>
            <p className="text-3xl font-bold text-red-600 mb-4">{counts.deniedLeaves}</p>
            <Link href="/admindash/leaves" className={buttonClasses}>
              Manage Leaves
            </Link>
          </div>
        </div>
      </div>

      {/* Task Management Section */}
      <div className={sectionClasses}>
        <div className="flex justify-center mb-6">
          <h2 className={sectionHeaderClasses}>
            <svg className="w-6 h-6 inline-block mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Task Management
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Active Tasks</h2>
            <p className="text-3xl font-bold text-blue-600 mb-4">{counts.activeTasks}</p>
            <Link href="/admindash/tasks" className={buttonClasses}>
              Manage Tasks
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Completed Tasks</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">{counts.completedTasks}</p>
            <Link href="/admindash/tasks" className={buttonClasses}>
              Manage Tasks
            </Link>
          </div>
          <div className={cardClasses}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Deleted Tasks</h2>
            <p className="text-3xl font-bold text-gray-600 mb-4">{counts.deletedTasks}</p>
            <Link href="/admindash/tasks" className={buttonClasses}>
              Manage Tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm bg-opacity-90 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Quick Actions</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/admindash/employeemanagement" className={`${buttonClasses} max-w-xs`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Manage Employees
          </Link>
          <Link href="/admindash/leaves" className={`${buttonClasses} max-w-xs`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Manage Leave Requests
          </Link>
          <Link href="/admindash/tasks" className={`${buttonClasses} max-w-xs`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Manage Tasks
          </Link>
          <button
            onClick={() => toast.info('Feature coming soon!', { duration: 3000 })}
            className={`${buttonClasses} max-w-xs`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Generate Reports
          </button>
          <button
            onClick={() => toast.info('Feature coming soon!', { duration: 3000 })}
            className={`${buttonClasses} max-w-xs`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            System Settings
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

export default Overvieww;