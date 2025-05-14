import mongoose, { Schema } from 'mongoose';

// Blood Bank Schema
const bloodBankSchema = new Schema(
  {
    bloodGroup: { 
      type: String, 
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
    },
    availableUnits: { 
      type: Number, 
      required: true 
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true, // Optionally, include timestamps for createdAt and updatedAt
  }
);

export const BloodBank = mongoose.model('BloodBank', bloodBankSchema);
