import express from 'express';
const router = express.Router();

import {createBloodBankEntry,getBloodBankEntryById,getAllBloodBankEntries,updateBloodBankEntry,deleteBloodBankEntry} from '../controllers/bloodBankController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new blood bank entry (admin/staff only)
router.post('/create', useroleAuth, authorizeRoles('admin', 'staff'), createBloodBankEntry);

// Get all blood bank entries (any logged-in user)
router.get('/', useroleAuth, getAllBloodBankEntries);

// Get a specific entry by ID
router.get('/:id', useroleAuth, getBloodBankEntryById);

// Update entry (admin/staff only)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff'), updateBloodBankEntry);

// Delete entry (admin only)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin'), deleteBloodBankEntry);

export { router as bloodBankRouter };

