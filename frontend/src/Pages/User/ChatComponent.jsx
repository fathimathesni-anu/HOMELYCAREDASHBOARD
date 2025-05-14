import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Adjust path as needed

const ChatComponent = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get('/chat', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const userMessages = res.data.filter(msg => {
        const sender = msg.senderId;
        const receiver = msg.receiverId;

        if (!sender || !receiver || !sender._id || !receiver._id) return false;

        return (
          (sender._id === currentUserId && receiver._id === selectedUserId) ||
          (sender._id === selectedUserId && receiver._id === currentUserId)
        );
      });

      setMessages(userMessages);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axiosInstance.post(
        '/chat/create',
        {
          senderId: currentUserId,
          receiverId: selectedUserId,
          message: newMessage,
          timestamp: new Date(),
          isRead: false,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessages(prev => [...prev, res.data.chat]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const deleteMessage = async id => {
    try {
      await axiosInstance.delete(`/chat/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(prev => prev.filter(msg => msg._id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  useEffect(() => {
    if (currentUserId && selectedUserId) {
      fetchChats();
    }
  }, [selectedUserId, currentUserId]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white shadow rounded-lg">
      <div className="h-96 overflow-y-auto border rounded p-2 mb-4">
        {messages.map(msg => (
          <div
            key={msg._id}
            className={`flex ${
              msg?.senderId?._id === currentUserId ? 'justify-end' : 'justify-start'
            } mb-2`}
          >
            <div className="max-w-xs px-4 py-2 rounded-lg bg-blue-100 text-sm relative">
              <p>{msg.message}</p>
              <button
                className="absolute top-0 right-0 text-xs text-red-400 hover:text-red-600"
                onClick={() => deleteMessage(msg._id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;











