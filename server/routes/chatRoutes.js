import express from 'express';
import {
  createChat,
  getAllChats,
  getChatCount,
  getChatById,
  updateChat,
  deleteChat,
} from '../controllers/chatController.js';
import { userAuth } from '../middleware/userAuth.js';

const router = express.Router();

// All routes protected by userAuth middleware
router.post('/', userAuth, createChat);
router.get('/', userAuth, getAllChats);
router.get('/count', userAuth, getChatCount);
router.get('/:id', userAuth, getChatById);
router.put('/:id', userAuth, updateChat);
router.delete('/:id', userAuth, deleteChat);

export { router as chatRouter };


