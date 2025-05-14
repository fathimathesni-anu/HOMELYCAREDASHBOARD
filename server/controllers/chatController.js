import { Chat } from '../models/chatmodel.js'; // Assuming your schema is in chatModel.js

// Create a chat message
export const createChatMessage = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json({ message: 'Chat message sent successfully', chat });
  } catch (error) {
    res.status(400).json({ message: 'Error sending chat message', error });
  }
};

// Get all chat messages
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('senderId receiverId');
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching chats', error });
  }
};

// Get chat message by ID
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('senderId receiverId');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching chat', error });
  }
};

// Update chat message (e.g., mark as read)
export const updateChatMessage = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.status(200).json({ message: 'Chat updated successfully', chat });
  } catch (error) {
    res.status(400).json({ message: 'Error updating chat', error });
  }
};

// Delete chat message
export const deleteChatMessage = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting chat', error });
  }
};

