import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    type: { type: String, enum: ['Appointment', 'Alert', 'Reminder'] },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
