import express from "express";
import { bookAppointment, getPatientAppointments } from "../controllers/appointmentScheduleController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/book", userAuth, bookAppointment);
router.get("/my-appointments", userAuth, getPatientAppointments);

export{router as appointmentScheduleRouter}; 

