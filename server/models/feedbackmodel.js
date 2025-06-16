import mongoose, { Schema } from 'mongoose';

const feedbackSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedbackText: { type: String },
    rating: { type: Number },
    date: { type: Date }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);


