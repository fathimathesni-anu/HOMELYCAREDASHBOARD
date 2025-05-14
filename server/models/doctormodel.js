import mongoose, { Schema } from 'mongoose';


const scheduleSchema = new Schema({
  doctorName: { type: String, required: true },
  specialization: { type: String, required: true },
  availableDays: [{ type: String }],        // Example: ["Monday", "Wednesday"]
  startTime: { type: String, required: true }, // Example: "09:00"
  endTime: { type: String, required: true },   // Example: "17:00"
  createdAt: { type: Date, default: Date.now }
});

// Doctor Schema
const doctorSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userole' },
    specialization: { type: String },
    schedule: [scheduleSchema],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
  },
  {
    timestamps: true, // Includes createdAt and updatedAt
  }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
