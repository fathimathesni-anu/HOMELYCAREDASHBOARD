import mongoose from "mongoose";

const appointmentScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // e.g., "2025-04-20"
  time: { type: String, required: true }, // e.g., "10:30"
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});


export const AppointmentSchedule = mongoose.model('AppointmentSchedule', appointmentScheduleSchema);