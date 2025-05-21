import mongoose, { Schema } from 'mongoose';

// Chat Message Schema
const chatMessageSchema = new Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
    message: { type: String },
    timestamp: { type: Date },
    isRead: { type: Boolean }
  },
  {
    timestamps: true, // Optional: includes createdAt and updatedAt
  }
);

export const Chat = mongoose.model('Chat', chatMessageSchema);
