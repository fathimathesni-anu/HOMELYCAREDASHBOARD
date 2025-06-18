/* // routes/staffRoutes.js
import express from 'express';
const router = express.Router();

import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  countStaff
} from '../controllers/staffController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new staff member (admin only)
router.post('/create', useroleAuth, authorizeRoles('admin','staff','doctor'), createStaff);

// Get all staff members (any logged-in user)
router.get('/', useroleAuth, getAllStaff);

// Get  count of all staff members (any logged-in user)
router.get('/count', useroleAuth, authorizeRoles('admin','staff','doctor'), countStaff);

// Get a staff member by ID
router.get('/:id', useroleAuth, getStaffById);

// Update staff member (admin or staff)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff','doctor'), updateStaff);

// Delete staff member (admin only)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin','staff','doctor'), deleteStaff);


export { router as staffRouter }; */


import express from 'express';
const router = express.Router();

import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  countStaff
} from '../controllers/staffController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

router.post('/create', useroleAuth, authorizeRoles('admin','staff','doctor'), createStaff);
router.get('/', useroleAuth, getAllStaff);
router.get('/count', useroleAuth, authorizeRoles('admin','staff','doctor'), countStaff);
router.get('/:id', useroleAuth, getStaffById);
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff','doctor'), updateStaff);
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin','staff','doctor'), deleteStaff);

export { router as staffRouter };

