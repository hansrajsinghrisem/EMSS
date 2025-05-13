import express from 'express';
import {
  signup,
  login,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getPendingUsers,
  approveUser,
  approveDeniedUser,
  oauthLogin,
  getApprovedUsers,
  denyUser,
  getDeniedUsers,
  getDeletedUsers,
  restoreUser,
  logoutUser,
  updateUserDetails,
  changeUserPassword,
  getLeaveRequestsByUser,
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);
router.get('/pending-users', getPendingUsers);
router.put('/approve/:id', approveUser);
router.put('/approve-denied/:id', approveDeniedUser);
router.post('/oauth-login', oauthLogin);
router.get('/approved-users', getApprovedUsers);
router.put('/deny/:id', denyUser);
router.get('/denied-users', getDeniedUsers);
router.get('/deleted-users', getDeletedUsers);
router.put('/restore/:id', restoreUser);
router.post('/logout', logoutUser);
router.put('/update-user-details', updateUserDetails);
router.put('/change-password', changeUserPassword);
router.get('/leave-requests', getLeaveRequestsByUser);

export default router;