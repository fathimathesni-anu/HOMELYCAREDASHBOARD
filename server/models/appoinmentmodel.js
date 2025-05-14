import mongoose, { Schema } from 'mongoose';

// Appointment Schema
const appointmentSchema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userole' },
    appointmentDate: { type: Date },
    reason: { type: String },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'] },
    notes: { type: String },
  },
  {
    timestamps: true, // Optionally, include timestamps for createdAt and updatedAt
  }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
