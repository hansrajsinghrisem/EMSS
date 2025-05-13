'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Home, CheckSquare, Calendar, Menu, X, LogOut } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserSidebar = ({ userId }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Check if screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Only auto-close on initial load for mobile
      if (mobile && typeof document !== 'undefined' && !document.documentElement.classList.contains('sidebar-initialized')) {
        setIsOpen(false);
        document.documentElement.classList.add('sidebar-initialized');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      console.log('Initiating logout...');
      // Call backend to clear session
      await axios.post(`${backendURL}/api/logout`, {}, { withCredentials: true });
      // Sign out from NextAuth
      await signOut({ redirect: false });
      toast.success('Logged out successfully', { duration: 3000 });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out', { duration: 5000 });
    }
  };

  const navItems = [
    { name: 'Dashboard', path: `/userdash/${userId}/overview`, icon: <Home size={20} /> },
    { name: 'Tasks', path: `/userdash/${userId}/tasks`, icon: <CheckSquare size={20} /> },
    { name: 'Leaves', path: `/userdash/${userId}/leave`, icon: <Calendar size={20} /> },
  ];

  return (
    <>
      {/* Overlay for when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'w-full md:w-64 translate-x-0' 
            : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center ml-14 md:ml-0 md:justify-center px-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            User Panel
          </h1>
        </div>
        
        <nav className="flex flex-col p-4 space-y-2 mt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-blue-50 hover:shadow-sm'
              }`}
              onClick={(e) => {
                console.log(`Navigating to ${item.path}`);
                if (isMobile) toggleSidebar();
              }}
            >
              <div className={pathname === item.path ? 'text-white' : 'text-gray-600'}>
                {item.icon}
              </div>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* Bottom section with Logout */}
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:shadow-sm"
          >
            <div className="text-red-600">
              <LogOut size={20} />
            </div>
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content container */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
        {/* Placeholder for page content */}
      </div>
    </>
  );
};

export default UserSidebar;