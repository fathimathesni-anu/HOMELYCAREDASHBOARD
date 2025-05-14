import express from 'express';
const router = express.Router();

import {
  createChatMessage,
  getAllChats,
  getChatById,
  updateChatMessage,
  deleteChatMessage
} from '../controllers/chatController.js';

import { userAuth } from '../middleware/userAuth.js';

// Create a new chat message
router.post('/create', userAuth, createChatMessage);

// Get all chats
router.get('/', userAuth, getAllChats);

// Get specific chat by ID
router.get('/:id', userAuth, getChatById);

// Update a chat (mark as read etc.)
router.put('/update/:id', userAuth, updateChatMessage);

// Delete a chat
router.delete('/delete/:id', userAuth, deleteChatMessage);

export { router as chatRouter };

