import express from 'express';
const router = express.Router();
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} from '../controllers/doctorController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new doctor (only admin can create typically)
router.post('/create', useroleAuth, authorizeRoles('admin','staff','doctor'), createDoctor);

// Get all doctors (any logged-in user)
router.get('/', useroleAuth, getAllDoctors);

// Get a doctor by ID
router.get('/:id', useroleAuth, getDoctorById);

// Update doctor (admin or staff)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff','doctor'), updateDoctor);

// Delete doctor (admin only)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin'), deleteDoctor);


export { router as doctorRouter };

