// routes/index.js
import express from "express";
const router = express.Router();

// Import all routers
import { userRouter } from "./userRoutes.js";
import { useroleRouter } from "./useroleRoutes.js";
import { patientRouter } from "./patientRoutes.js";
import { appoinmentRouter } from "./appoinmentRoutes.js";
import { appointmentScheduleRouter } from "./AppointmentScheduleRoutes.js";
import { doctorRouter } from "./doctorRoutes.js";
import { doctorScheduleRouter } from "./doctorScheduleRoutes.js";
import { bloodBankRouter } from "./bloodbankRoutes.js";
import { chatRouter } from "./chatRoutes.js";
import { feedbackRouter } from "./feedbackRoutes.js";
import { notificationRouter } from "./notificationRoutes.js";
import { staffRouter } from "./staffRoutes.js";
import { taskRouter } from "./taskRoutes.js";

// Apply routers to paths
router.use("/user", userRouter);
router.use("/userole", useroleRouter);
router.use("/patient", patientRouter);
router.use("/appoinment", appoinmentRouter);
router.use("/appointmentschedule", appointmentScheduleRouter);
router.use("/doctor", doctorRouter);
router.use("/doctorschedule", doctorScheduleRouter);
router.use("/bloodbank", bloodBankRouter);
router.use("/chat", chatRouter);
router.use("/feedback", feedbackRouter);
router.use("/notification", notificationRouter);
router.use("/staff", staffRouter);
router.use("/task", taskRouter);

export { router as apiRouter };
