import mongoose from 'mongoose';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

// 🔵 Register (Signup)
export const signup = async (req, res) => {
  try {
    const { fname, lname, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      fname,
      lname,
      email,
      oauthEmail: null, // No OAuth email for credentials signup
      phone,
      password,
      role: role || 'user',
      isApproved: false,
    });

    res.status(201).json({ message: 'User registered. Awaiting admin approval.', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed. Please try again later.', error: error.message });
  }
};

// 🔵 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'You are not approved by the admin yet.' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        role: user.role,
        isApproved: user.isApproved,
        provider: user.provider,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔵 Get all users
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

// 🔵 Get one user by ID
export const getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// 🔵 Update user
export const updateEmployee = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// 🔵 Delete user
export const deleteEmployee = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User soft-deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error soft-deleting user', error: error.message });
  }
};

// 🔵 Get pending users
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false, isDenied: false, isDeleted: false });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending users', error: error.message });
  }
};

// 🔵 Approve user
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving user', error: error.message });
  }
};

// 🔵 Approve denied user
export const approveDeniedUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isDenied: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Denied user approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving denied user', error: error.message });
  }
};

// 🔵 Handle OAuth login
export const oauthLogin = async (req, res) => {
  console.log("↳ [backend] /api/oauth-login hit:", req.body);
  const { email, name, provider } = req.body;

  try {
    let user = await User.findOne({ oauthEmail: email });
    if (!user) {
      user = await User.findOne({ email, provider: 'credentials' });
      if (user) {
        // Link existing credentials user to OAuth
        user.oauthEmail = email;
        user.provider = provider;
        await user.save();
      } else {
        // Create new user
        console.log("↳ Creating new OAuth user:", email);
        const [fname, lname = ""] = name.split(" ");
        user = await User.create({
          fname,
          lname,
          email,
          oauthEmail: email,
          password: "oauth",
          provider,
          role: "user",
          isApproved: true,
        });
      }
    }
    console.log("↳ User isApproved:", user.isApproved);
    if (!user.isApproved) {
      return res.status(403).json({ message: "User not approved", user });
    }
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        role: user.role,
        isApproved: user.isApproved,
        provider: user.provider,
      },
    });
  } catch (err) {
    console.error("↳ OAuth login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔵 Get approved users
export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: true, isDeleted: false });
    console.log('Fetched approved users:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching approved users:', error);
    res.status(500).json({ message: 'Error fetching approved users', error: error.message });
  }
};

// ❌ Deny (mark as denied) a pending user
export const denyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      isApproved: false,
      isDeleted: { $ne: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found or already processed' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isDenied: true },
      { new: true }
    );

    res.status(200).json({ message: 'Pending user denied successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error denying user', error: error.message });
  }
};

// 🔵 Get denied users
export const getDeniedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDenied: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching denied users', error: error.message });
  }
};

// 🗑️ Get all deleted users (soft-deleted users with isDeleted = true)
export const getDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deleted users', error: error.message });
  }
};

// ♻️ Restore deleted user (set isDeleted to false)
export const restoreUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'Deleted user not found' });
    res.status(200).json({ message: 'User restored successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring user', error: error.message });
  }
};

// Logout user (invalidate session)
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('next-auth.session-token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logoutUser:', error);
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

// Update user details
export const updateUserDetails = async (req, res) => {
  try {
    const { userId, fname, lname, email } = req.body;

    console.log('Update user details:', { userId, fname, lname, email });

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!fname || !lname) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent email changes for OAuth users
    if (user.provider !== 'credentials' && email && email !== user.email) {
      return res.status(400).json({ message: 'Email cannot be changed for OAuth users' });
    }

    user.fname = fname;
    user.lname = lname;
    if (user.provider === 'credentials' && email) {
      user.email = email;
    }
    await user.save();

    res.status(200).json({ message: 'User details updated', user });
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Error updating user details', error: error.message });
  }
};

// Change user password
export const changeUserPassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = req.body;

    console.log('Change user password:', { userId });

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For OAuth users with placeholder password
    if (user.password === 'oauth' && user.provider !== 'credentials') {
      if (oldPassword !== 'oauth') {
        return res.status(400).json({ message: 'Incorrect old password' });
      }
    } else {
      let isMatch = false;
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(oldPassword, user.password);
      } else {
        isMatch = oldPassword === user.password;
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    if (user.provider !== 'credentials') {
      user.provider = 'credentials'; // Allow credentials login after setting password
    }
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changeUserPassword:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

export const getLeaveRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const leaveRequests = await LeaveRequest.find({ userId });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching leave requests' });
  }
};