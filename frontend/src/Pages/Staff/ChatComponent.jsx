import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const ChatComponent = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [receiverModel, setReceiverModel] = useState('User');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  // Fetch chats and users on load
  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

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

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/userole/users'); // Adjust endpoint if needed
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };

  const sendMessage = async () => {
    if (!receiverId || !message || !receiverModel) {
      return alert('All fields are required');
    }

    try {
      const res = await axiosInstance.post('/chat', {
        receiverId,
        receiverModel,
        message,
      });
      setChats(prev => [res.data.chat, ...prev]);
      setMessage('');
      setReceiverId('');
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

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700">💬 Chat Box</h2>

      {/* Message Form */}
      <div className="mb-6 space-y-4">
        {/* Receiver Dropdown */}
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Receiver</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name || user.username || user.email}
            </option>
          ))}
        </select>

        {/* Receiver Model Dropdown */}
        <select
          value={receiverModel}
          onChange={(e) => setReceiverModel(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="User">User</option>
          <option value="Userole">Doctor/Admin/Staff</option>
        </select>

        {/* Message Input */}
        <textarea
          rows="4"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />

        <button
          onClick={sendMessage}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➤ Send
        </button>
      </div>

      {/* Chat Messages */}
      {loading ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : chats.length === 0 ? (
        <p className="text-center text-gray-400">No messages yet.</p>
      ) : (
        <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
          {chats.map((chat) => (
            <li
              key={chat._id}
              className="p-4 rounded-lg border bg-gray-50 shadow-sm relative flex flex-col sm:flex-row sm:justify-between sm:items-start"
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={chat.senderId?.profilepic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Sender"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    <strong>From:</strong> {chat.senderId?.name || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={chat.receiverId?.profilepic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="Receiver"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    <strong>To:</strong> {chat.receiverId?.name || "Unknown"}
                  </span>
                </div>

                {editId === chat._id ? (
                  <>
                    <textarea
                      className="w-full p-2 border rounded mb-2 resize-none"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateMessage(chat._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex-grow sm:flex-grow-0"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 flex-grow sm:flex-grow-0"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-base text-gray-800 break-words">{chat.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(chat.createdAt).toLocaleString()}
                    </p>
                  </>
                )}
              </div>

              {editId !== chat._id && (
                <div className="mt-3 sm:mt-0 flex gap-3 flex-wrap sm:flex-col sm:items-end">
                  <button
                    onClick={() => {
                      setEditId(chat._id);
                      setEditMessage(chat.message);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMessage(chat._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatComponent;

