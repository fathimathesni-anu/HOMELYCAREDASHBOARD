import mongoose, { Schema } from 'mongoose';

// Optional: Define a separate Schedule schema if it's reused
const scheduleSchema = new Schema({
  day: { type: String }, // e.g., 'Monday'
  startTime: { type: String }, // e.g., '09:00'
  endTime: { type: String }, // e.g., '17:00'
});

// Staff Schema
const staffSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Userole', required: true },
    position: { type: String, required: true }, // e.g., 'Nurse', 'Technician'
    department: { type: String }, // e.g., 'Radiology', 'Cardiology'
    contactInfo: {
      phone: { type: String },
      email: { type: String },
    },
    schedule: [scheduleSchema],
    assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  },
  {
    timestamps: true,
  }
);

export const Staff = mongoose.model('Staff', staffSchema);

