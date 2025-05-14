import mongoose, { Schema } from 'mongoose';

// Task Schema
const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Userole' }, // whoever created the task
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: { type: Date },
    completedAt: { type: Date },
    notes: [{ body: String, date: Date }],
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model('Task', taskSchema);

