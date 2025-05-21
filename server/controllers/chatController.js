import { Chat } from '../models/chatmodel.js'; // Assuming your schema is in chatModel.js

// Create a chat message
/* export const createChatMessage = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).json({ message: 'Chat message sent successfully', chat });
  } catch (error) {
    res.status(400).json({ message: 'Error sending chat message', error });
  }
}; */

export const createChatMessage = async (req, res) => {
  try {
    const senderId = req.user._id; // set sender from authenticated user
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'receiverId and message are required' });
    }

    const chat = new Chat({
      senderId,
      receiverId,
      message,
      isRead: false,
      timestamp: new Date()
    });

    await chat.save();
    res.status(201).json({ message: 'Chat message sent successfully', chat });
  } catch (error) {
    res.status(400).json({ message: 'Error sending chat message', error: error.message });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId receiverId');

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching chats', error });
  }
};


export const getChatById = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findById(req.params.id).populate('senderId receiverId');

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Only allow if user is sender or receiver
    if (chat.senderId._id.toString() !== userId && chat.receiverId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching chat', error });
  }
};


/* 
export const updateChatMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Only sender or receiver can update the chat
    if (chat.senderId.toString() !== userId && chat.receiverId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this chat' });
    }

    Object.assign(chat, req.body);
    await chat.save();

    res.status(200).json({ message: 'Chat updated successfully', chat });
  } catch (error) {
    res.status(400).json({ message: 'Error updating chat', error });
  }
};



export const deleteChatMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Only sender or receiver can delete the chat
    if (chat.senderId.toString() !== userId && chat.receiverId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this chat' });
    }

    await chat.remove();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting chat', error });
  }
}; */


export const updateChatMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const senderId = chat.senderId._id?.toString?.() || chat.senderId.toString();
    const receiverId = chat.receiverId._id?.toString?.() || chat.receiverId.toString();

    if (senderId !== userId && receiverId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this chat' });
    }

    Object.assign(chat, req.body);
    await chat.save();

    res.status(200).json({ message: 'Chat updated successfully', chat });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(400).json({ message: 'Error updating chat', error: error.message });
  }
};


export const deleteChatMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const senderId = chat.senderId._id?.toString?.() || chat.senderId.toString();
    const receiverId = chat.receiverId._id?.toString?.() || chat.receiverId.toString();

    if (senderId !== userId && receiverId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this chat' });
    }

    await chat.remove();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(400).json({ message: 'Error deleting chat', error: error.message });
  }
};
