import express from 'express';
const router = express.Router();

import {createBloodBankEntry,getBloodBankEntryById,getAllBloodBankEntries,updateBloodBankEntry,deleteBloodBankEntry, getcountBloodBankEntries} from '../controllers/bloodBankController.js';

import { useroleAuth, authorizeRoles } from '../middleware/useroleAuth.js';

// Create a new blood bank entry (admin/staff only)
router.post('/create', useroleAuth, authorizeRoles('admin', 'staff'), createBloodBankEntry);

// Get all blood bank entries (any logged-in user)
router.get('/', useroleAuth, getAllBloodBankEntries);

// Get count of blood bank entries (any logged-in user)
router.get('/count', useroleAuth, getcountBloodBankEntries);

// Get a specific entry by ID
router.get('/:id', useroleAuth, getBloodBankEntryById);

// Update entry (admin/staff only)
router.put('/update/:id', useroleAuth, authorizeRoles('admin', 'staff'), updateBloodBankEntry);

// Delete entry (admin/ staff only)
router.delete('/delete/:id', useroleAuth, authorizeRoles('admin','staff'), deleteBloodBankEntry);

export { router as bloodBankRouter };

