import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ChatComponent = () => {
  const [chats, setChats] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/chat');
      setChats(res.data.chats);
    } catch (error) {
      console.error('Error fetching chats:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!receiverId || !message) return alert('Receiver ID and message required');
    try {
      const res = await axiosInstance.post('/chat', { receiverId, message });
      setChats(prev => [res.data.chat, ...prev]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  const updateMessage = async (chatId) => {
    try {
      const res = await axiosInstance.put(`/chat/${chatId}`, { message: editMessage });
      setChats(prev => prev.map(chat => chat._id === chatId ? res.data.chat : chat));
      setEditId(null);
      setEditMessage('');
    } catch (error) {
      console.error('Error updating message:', error.response?.data || error.message);
    }
  };

  const deleteMessage = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axiosInstance.delete(`/chat/${chatId}`);
      setChats(prev => prev.filter(chat => chat._id !== chatId));
    } catch (error) {
      console.error('Error deleting message:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">💬 Chat Box</h2>

      {/* Message Form */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Receiver User ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />
        <textarea
          rows="3"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
        />
        <button
          onClick={sendMessage}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
        >
          ➤ Send
        </button>
      </div>

      {/* Chat Messages */}
      {loading ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">Loading messages...</p>
      ) : (
        <ul className="space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1">
          {chats.map((chat) => (
            <li
              key={chat._id}
              className="p-4 rounded-lg border bg-gray-50 shadow-sm relative"
            >
              <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 mb-2 space-y-1 sm:space-y-0 sm:space-x-4">
                <span><strong>From:</strong> {chat.senderId}</span>
                <span><strong>To:</strong> {chat.receiverId}</span>
              </div>

              {editId === chat._id ? (
                <>
                  <textarea
                    className="w-full p-2 border rounded mb-2 text-sm sm:text-base"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    rows="3"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => updateMessage(chat._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm sm:text-base"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">{chat.message}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    {new Date(chat.timestamp || chat.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-3 flex gap-4 justify-end text-sm sm:text-base">
                    <button
                      onClick={() => {
                        setEditId(chat._id);
                        setEditMessage(chat.message);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMessage(chat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatComponent;


