import mongoose, { Schema } from 'mongoose';

// Chat Message Schema
const chatMessageSchema = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    timestamp: { type: Date },
    isRead: { type: Boolean }
  },
  {
    timestamps: true, // Optional: includes createdAt and updatedAt
  }
);

export const Chat = mongoose.model('Chat', chatMessageSchema);
