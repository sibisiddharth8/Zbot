import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Chat/Sidebar';
import ChatBox from '../components/Chat/ChatBox';
import api from '../api/api';

const Chat = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const token = localStorage.getItem('token');

  const fetchChat = async () => {
    try {
      const res = await axios.get(`${api.endpoint}/api/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChat(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block" style={{ resize: 'horizontal', overflow: 'auto', minWidth: '250px', maxWidth: '350px' }}>
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button 
          onClick={() => setSidebarVisible(true)} 
          className="bg-gray-800 hover:bg-gray-700 text-blue-400 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform transform hover:scale-110"
        >
          <FaBars size={28} />
        </button>
      </div>
      
      {/* Mobile Sidebar Modal */}
      {sidebarVisible && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="w-64 bg-gray-900 overflow-auto"
            style={{ resize: 'horizontal', minWidth: '250px', maxWidth: '350px' }}
          >
            <Sidebar />
          </div>
          <div className="flex-grow" onClick={() => setSidebarVisible(false)}></div>
        </div>
      )}
      
      {/* Chat Conversation Area */}
      <div className="pt-16 flex-grow">
        {chat ? (
          <ChatBox chat={chat} refreshChat={fetchChat} />
        ) : (
          <div className="p-4 text-gray-200">Loading chat...</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
