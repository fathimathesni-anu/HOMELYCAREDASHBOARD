import express from 'express';
import {
  addScheduleToDoctor,
  updateDoctorSchedule,
  deleteDoctorSchedule,
  getDoctorSchedule,
} from '../controllers/doctorScheduleController.js';

import { useroleAuth, authorizeRoles} from '../middleware/useroleAuth.js';

const router = express.Router();

// Add a schedule to a doctor (admin or staff)
router.post(
  '/:doctorId/schedules',
  useroleAuth,
  authorizeRoles('admin', 'staff','doctor'),
  addScheduleToDoctor
);

// Update a doctor's schedule by index (admin or staff)
router.put(
  '/:doctorId/schedules/:scheduleIndex',
  useroleAuth,
  authorizeRoles('admin', 'staff','doctor'),
  updateDoctorSchedule
);

// Delete a doctor's schedule by index (admin only)
router.delete(
  '/:doctorId/schedules/:scheduleIndex',
  useroleAuth,
  authorizeRoles('admin'),
  deleteDoctorSchedule
);

router.get(
  '/:doctorId',
  useroleAuth,
  authorizeRoles('admin', 'staff','doctor'),getDoctorSchedule);



export { router as doctorScheduleRouter };

