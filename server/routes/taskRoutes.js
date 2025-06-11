import express from 'express';
const router = express.Router();

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  countTasks,            // New
} from '../controllers/taskController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new task (admin, staff, doctor)
router.post('/create', useroleAuth, authorizeRoles('admin','staff','doctor'), createTask);

// Get all tasks (any logged-in user)
router.get('/', useroleAuth, getAllTasks);

// Get total count of tasks
router.get('/count', useroleAuth, countTasks);


// Get a task by ID
router.get('/:id', useroleAuth, getTaskById);

// Update a task (admin, staff, doctor)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff','doctor'), updateTask);

// Delete a task (admin, staff, doctor)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin','staff','doctor'), deleteTask);

export { router as taskRouter };


