'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { data: session, status } = useSession();
  const [detailsForm, setDetailsForm] = useState({
    fname: '',
    lname: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Load user details
  useEffect(() => {
    if (session?.user) {
      setDetailsForm({
        fname: session.user.fname || '',
        lname: session.user.lname || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  // Handle details form changes
  const handleDetailsChange = (e) => {
    setDetailsForm({ ...detailsForm, [e.target.name]: e.target.value });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Submit details update
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${backendURL}/api/profile`, {
        userId: session.user.id,
        ...detailsForm,
      });
      toast.success('Profile updated successfully', { duration: 3000 });
      // Update session data (requires session callback in NextAuth)
      // For simplicity, refresh the page or update session manually
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${backendURL}/api/profile/password`, {
        userId: session.user.id,
        ...passwordForm,
      });
      toast.success('Password updated successfully', { duration: 3000 });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(err.response?.data?.message || 'Failed to change password', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-20 text-lg font-medium text-gray-600 animate-pulse">Loading...</div>;
  }
  if (!session?.user || session.user.role !== 'admin') {
    return <div className="text-center py-20 text-lg font-medium text-red-600">You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800 tracking-tight">
        Profile Settings
      </h1>

      {/* Update Personal Details */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm bg-opacity-90 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Personal Details</h2>
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="fname">First Name</label>
            <input
              type="text"
              name="fname"
              value={detailsForm.fname}
              onChange={handleDetailsChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="lname">Last Name</label>
            <input
              type="text"
              name="lname"
              value={detailsForm.lname}
              onChange={handleDetailsChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={detailsForm.email}
              onChange={handleDetailsChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm bg-opacity-90">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfileSettings;