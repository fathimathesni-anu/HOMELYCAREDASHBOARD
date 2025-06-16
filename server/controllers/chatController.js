import { Chat } from '../models/chatmodel.js';

// Create a chat message
export const createChat = async (req, res) => {
  try {
    const { receiverId, receiverModel, message } = req.body;
    const senderId = req.user.id;
    const senderModel = req.user.role === 'doctor' || req.user.role === 'admin' || req.user.role === 'staff'
      ? 'Userole'
      : 'User';

    const chat = await Chat.create({
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      message,
      isRead: false,
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate({ path: 'senderId', model: senderModel, select: 'name profilepic' })
      .populate({ path: 'receiverId', model: receiverModel, select: 'name profilepic' });

    res.status(201).json({ success: true, chat: populatedChat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all chat messages for current user
export const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'senderId', select: 'name profilepic', model: 'User' })
      .populate({ path: 'receiverId', select: 'name profilepic', model: 'User' })
      .populate({ path: 'senderId', select: 'name profilepic', model: 'Userole' })
      .populate({ path: 'receiverId', select: 'name profilepic', model: 'Userole' });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single chat message by ID
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate({ path: 'senderId', select: 'name profilepic', model: 'User' })
      .populate({ path: 'receiverId', select: 'name profilepic', model: 'User' })
      .populate({ path: 'senderId', select: 'name profilepic', model: 'Userole' })
      .populate({ path: 'receiverId', select: 'name profilepic', model: 'Userole' });

    if (!chat || (chat.senderId._id.toString() !== req.user.id && chat.receiverId._id.toString() !== req.user.id)) {
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

    chat.message = req.body.message ?? chat.message;
    chat.isRead = req.body.isRead ?? chat.isRead;
    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate({ path: 'senderId', select: 'name profilepic', model: chat.senderModel })
      .populate({ path: 'receiverId', select: 'name profilepic', model: chat.receiverModel });

    res.status(200).json({ success: true, chat: updatedChat });
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

    await chat.deleteOne();

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


