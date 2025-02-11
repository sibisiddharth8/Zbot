import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import api from '../../api/api';

const Sidebar = () => {
  const [chats, setChats] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${api.endpoint}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const createNewChat = async () => {
    try {
      const res = await axios.post(`${api.endpoint}/api/chat`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(prev => [res.data, ...prev]);
      navigate(`/chat/${res.data._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${api.endpoint}/api/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get(`${api.endpoint}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
      if (res.data.length === 0) {
        await createNewChat();
      } else if (location.pathname === `/chat/${chatId}`) {
        navigate(`/chat/${res.data[0]._id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (chatId) => {
    try {
      await axios.put(`${api.endpoint}/api/chat/${chatId}/title`, { title: newTitle }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingChatId(null);
      setNewTitle('');
      fetchChats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 border-r border-gray-700 pt-16">
      {/* Sticky Header with "New Chat" Button */}
      <div className="sticky top-0 z-10 bg-gray-900 p-3 border-b border-gray-700">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition-all duration-200"
        >
          New Chat
        </button>
      </div>
      {/* Scrollable Chat List */}
      <div className="flex-grow overflow-y-auto hide-scrollbar px-3 pt-3">
        {chats.length === 0 ? (
          <div className="text-gray-400">No chats available.</div>
        ) : (
          chats.map(chat => {
            const isActive = location.pathname === `/chat/${chat._id}`;
            return (
              <div
                key={chat._id}
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              >
                {editingChatId === chat._id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => updateTitle(chat._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateTitle(chat._id);
                    }}
                    className="flex-grow bg-gray-800 border border-gray-600 p-1 rounded text-gray-200 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <Link
                    to={`/chat/${chat._id}`}
                    className="flex-grow text-gray-200 font-medium"
                    onDoubleClick={() => {
                      setEditingChatId(chat._id);
                      setNewTitle(chat.title);
                    }}
                  >
                    {chat.title || "Untitled Chat"}
                  </Link>
                )}
                <button
                  onClick={() => deleteChat(chat._id)}
                  className="ml-3 text-red-500 hover:text-red-400 transition-colors"
                  title="Delete Chat"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
