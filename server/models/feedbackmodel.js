import mongoose, { Schema } from 'mongoose';

const feedbackSchema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    feedbackText: { type: String },
    rating: { type: Number },
    date: { type: Date }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
