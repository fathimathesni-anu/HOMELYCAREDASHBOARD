import { Chat } from '../models/chatmodel.js';

// Create a chat message
export const createChat = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id; // From JWT

    const chat = new Chat({
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
      isRead: false,
    });

    await chat.save();
    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all chat messages for current user (sent or received)
export const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single chat message by ID (only if user is part of it)
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || (chat.senderId.toString() !== req.user.id && chat.receiverId.toString() !== req.user.id)) {
      return res.status(404).json({ success: false, message: 'Chat not found or unauthorized' });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a chat message (only by sender)
export const updateChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.senderId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this message' });
    }

    chat.message = req.body.message || chat.message;
    chat.isRead = req.body.isRead ?? chat.isRead;
    await chat.save();

    res.status(200).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a chat message (only by sender)
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat || chat.senderId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
    }

    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get total count of chat documents
export const getChatCount = async (req, res) => {
  try {
    const count = await Chat.countDocuments();
    res.status(200).json({ totalChats: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to count chats', error });
  }
};
