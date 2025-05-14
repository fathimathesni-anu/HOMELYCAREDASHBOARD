 import express from 'express';
const router = express.Router();
import { useroleAuth,authorizeRoles } from '../middleware/useroleAuth.js'; 
import { 
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from'../controllers/patientController.js';
// Create a new patient ( admin and staff users can create)
router.post('/create', useroleAuth,authorizeRoles('admin','staff','doctor'),createPatient);

// // Get all patients (Accessible by all users)
router.get('/', useroleAuth, getAllPatients);

// Get a patient by ID (Accessible by all users)
router.get('/:id', useroleAuth, getPatientById);

// Update a patient ( admin,doctor and staff users can update)
router.put('/update/:id', useroleAuth, authorizeRoles('admin','staff','doctor'), updatePatient);

// Delete a patient ( admin,doctor and staff users can delete)
router.delete('/delete/:id', useroleAuth,authorizeRoles('admin','staff','doctor'), deletePatient);

export{router as patientRouter}; 
