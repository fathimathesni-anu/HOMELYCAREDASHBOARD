import express from "express";
import { bookAppointment, getPatientAppointments,updateAppointmentStatus,updateAppointment,deleteAppointment } from "../controllers/appointmentScheduleController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/book", userAuth, bookAppointment);
router.get("/my-appointments", userAuth, getPatientAppointments);
router.put("/:appointmentId/status",userAuth , updateAppointmentStatus);
router.put('/:appointmentId', updateAppointment);
router.delete('/:appointmentId', deleteAppointment);

export{router as appointmentScheduleRouter}; 

