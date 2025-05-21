import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ChatComponent = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chats
  const fetchChats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/chat');
      setChats(res.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!receiverId.trim() || !message.trim()) {
      alert('Please enter a receiver ID and a message');
      return;
    }
    try {
      await axiosInstance.post('/chat/create', { receiverId, message });
      setMessage('');
      setReceiverId('');
      fetchChats();
    } catch (err) {
      console.error('Send error:', err.response?.data || err.message);
      alert('Error sending message: ' + (err.response?.data?.message || err.message));
    }
  };

  // Mark chat as read
  const markAsRead = async (chatId) => {
    try {
      await axiosInstance.put(`/chat/update/${chatId}`, { isRead: true });
      fetchChats();
    } catch (err) {
      console.error('Mark as read error:', err.response?.data || err.message);
      alert('Failed to mark as read: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete a chat
  const deleteChat = async (chatId) => {
    try {
      await axiosInstance.delete(`/chat/delete/${chatId}`);
      fetchChats();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert('Failed to delete chat: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Chat Messages</h2>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <input
          type="text"
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {chats.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat._id}
            className="border border-gray-300 rounded p-4 mb-4 shadow-sm"
          >
            <p><strong>From:</strong> {chat.senderId?.name || chat.senderId?._id}</p>
            <p><strong>To:</strong> {chat.receiverId?.name || chat.receiverId?._id}</p>
            <p><strong>Message:</strong> {chat.message}</p>
            <p className="text-sm text-gray-500">{new Date(chat.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {chat.isRead ? 'Read' : 'Unread'}</p>

            <div className="mt-3 flex gap-2">
              {!chat.isRead && (
                <button
                  onClick={() => markAsRead(chat._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => deleteChat(chat._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatComponent;
