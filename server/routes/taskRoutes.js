// routes/taskRoutes.js
import express from 'express';
const router = express.Router();

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new task (admin only)
router.post('/create', useroleAuth, authorizeRoles('admin'), createTask);

// Get all tasks (any logged-in user)
router.get('/', useroleAuth, getAllTasks);

// Get a task by ID
router.get('/:id', useroleAuth, getTaskById);

// Update a task (admin or staff)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff'), updateTask);

// Delete a task (admin only)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin'), deleteTask);

export { router as taskRouter };

