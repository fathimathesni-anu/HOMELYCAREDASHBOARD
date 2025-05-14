// routes/staffRoutes.js
import express from 'express';
const router = express.Router();

import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new staff member (admin only)
router.post('/create', useroleAuth, authorizeRoles('admin'), createStaff);

// Get all staff members (any logged-in user)
router.get('/', useroleAuth, getAllStaff);

// Get a staff member by ID
router.get('/:id', useroleAuth, getStaffById);

// Update staff member (admin or staff)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff'), updateStaff);

// Delete staff member (admin only)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin'), deleteStaff);

export { router as staffRouter };

