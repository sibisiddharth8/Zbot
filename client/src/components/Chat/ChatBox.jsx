import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import api from '../../api/api';

const ChatBox = ({ chat, refreshChat }) => {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState(chat.messages || []);
  const token = localStorage.getItem('token');

  // Whenever chat.messages changes, update localMessages.
  // If the last message is from the user, append a temporary loader message.
  useEffect(() => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMsg = chat.messages[chat.messages.length - 1];
      if (lastMsg.role === 'user') {
        // Append a loader message if the bot reply is not yet available.
        setLocalMessages([...chat.messages, { role: 'assistant', loading: true }]);
      } else {
        setLocalMessages(chat.messages);
      }
    } else {
      setLocalMessages([]);
    }
  }, [chat.messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Optimistically update: add your message and a loader message
    const userMessage = { role: 'user', content: input };
    const loaderMessage = { role: 'assistant', loading: true };
    setLocalMessages(prev => [...prev, userMessage, loaderMessage]);
    const currentInput = input;
    setInput('');
    
    try {
      const res = await axios.post(`${api.endpoint}/api/chat/${chat._id}/message`, { message: currentInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // After receiving updated chat from backend, refresh the messages.
      if (res.data && res.data.chat) {
        const updatedMessages = res.data.chat.messages;
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'user') {
          // Append loader if the assistant reply is pending.
          setLocalMessages([...updatedMessages, { role: 'assistant', loading: true }]);
        } else {
          setLocalMessages(updatedMessages);
        }
      }
    } catch (error) {
      console.error(error);
      // Remove any loader if an error occurs.
      setLocalMessages(prev => prev.filter(msg => !msg.loading));
    }
  };

  return (
    <div className="relative h-full">
      {/* Scrollable messages container */}
      <div className="absolute top-0 bottom-20 left-0 right-0 overflow-y-auto p-4 space-y-2 hide-scrollbar">
        {localMessages.map((msg, index) => (
          <Message key={msg._id || index} chatId={chat._id} message={msg} refreshChat={refreshChat} />
        ))}
      </div>
      {/* Fixed input container */}
      <div className="absolute bottom-0 w-full right-0 p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border border-gray-600 p-2 rounded-l-full bg-gray-900 text-gray-200 focus:outline-none"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-full">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
