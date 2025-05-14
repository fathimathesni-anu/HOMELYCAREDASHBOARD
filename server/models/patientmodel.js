import mongoose, { Schema } from 'mongoose';

// Patient Schema
const patientSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    age: { 
      type: Number, 
      required: true 
    },
    gender: { 
      type: String, 
      required: true 
    },
    contactInfo: {
      phone: { 
        type: String, 
        required: true 
      },
      email: { 
        type: String, 
        required: true, 
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'] 
      },
      address: { 
        type: String, 
        required: true 
      },
    },
    medicalHistory: [{ 
      type: String 
    }],
    assignedDoctor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Userole', 
      required: true 
    },
    appointments: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Appointment' 
    }],
  },
  {
    timestamps: true,
  }
);

export const Patient = mongoose.model('Patient', patientSchema);
