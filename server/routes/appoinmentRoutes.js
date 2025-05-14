
 import express from 'express';
const router = express.Router();
import { useroleAuth,authorizeRoles } from '../middleware/useroleAuth.js'; 
import { createAppointment,getAllAppointments,getAppointmentById,updateAppointment,deleteAppointment} from '../controllers/appoinmentController.js'
// Create a new patient ( admin and staff users can create)
router.post('/create', useroleAuth,authorizeRoles('admin','staff','doctor'),createAppointment);

// // Get all patients (Accessible by all users)
router.get('/', useroleAuth, getAllAppointments);

// Get a patient by ID (Accessible by all users)
router.get('/:id', useroleAuth,getAppointmentById );

// Update a patient ( admin,doctor and staff users can update)
router.put('/update/:id', useroleAuth, authorizeRoles('admin','staff','doctor'), updateAppointment);

// Delete a patient ( admin,doctor and staff users can delete)
router.delete('/delete/:id', useroleAuth,authorizeRoles('admin','staff','doctor'), deleteAppointment);

export{router as appoinmentRouter}; 