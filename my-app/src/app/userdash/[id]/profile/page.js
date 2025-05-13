'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ProfileSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profileForm, setProfileForm] = useState({ fname: '', lname: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        fname: session.user.fname || '',
        lname: session.user.lname || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/update-user-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, ...profileForm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id, ...passwordForm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update password');
      toast.success('Password updated successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const isOAuthUser = session?.user?.provider !== 'credentials';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Settings</h2>
      <div className="space-y-6">
        <form onSubmit={handleProfileSubmit} className="space-y-3">
          <h3 className="text-lg font-medium text-gray-700">Update Profile</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="fname"
              value={profileForm.fname}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lname"
              value={profileForm.lname}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              disabled={isOAuthUser}
              className={`w-full px-3 py-2 rounded-md border border-gray-300 ${
                isOAuthUser ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              required
            />
            {isOAuthUser && (
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed for OAuth users.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
            }`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <h3 className="text-lg font-medium text-gray-700">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              placeholder={isOAuthUser ? "Enter 'oauth'" : 'Enter your old password'}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
            }`}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}