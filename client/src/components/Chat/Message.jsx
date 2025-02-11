import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Loader from './Loader';
import axios from 'axios';
import api from '../../api/api';

const Message = ({ chatId, message, refreshChat }) => {
  // Local state for editing and saving
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);
  // Local flag to show loader for updated (edited) messages
  const [localLoading, setLocalLoading] = useState(false);
  const token = localStorage.getItem('token');

  const updateMessage = async () => {
    setLocalLoading(true);
    setIsEditing(false);
    try {
      await axios.put(
        `${api.endpoint}/api/chat/${chatId}/message/${message._id}`,
        { content: editedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalLoading(false);
      refreshChat();
    } catch (error) {
      console.error(error);
      setLocalLoading(false);
    }
  };

  // Bubble styling for non-edit mode
  const userBubbleClasses =
    "bg-blue-600 text-white self-end rounded-lg rounded-br-none p-4 shadow-md";
  const assistantBubbleClasses =
    "bg-gray-700 text-gray-200 self-start rounded-lg rounded-bl-none p-4 shadow-md";

  // Edit mode styling (for user messages only)
  if (isEditing) {
    return (
      <div className={`my-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`w-full max-w-[80%] ${message.role === 'user' ? userBubbleClasses : assistantBubbleClasses} relative`}>
          {/* Use a slightly lighter blue for the textarea to indicate edit mode */}
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full bg-blue-500 text-white placeholder-gray-300 border border-blue-400 rounded p-2 focus:outline-none resize-none"
            rows={3}
            placeholder="Edit your message..."
          />
          <div className="flex justify-end mt-3 space-x-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedText(message.content);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={updateMessage}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Non-edit mode: Render the message bubble with markdown.
  return (
    <div className={`my-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`w-full max-w-[80%] ${message.role === 'user' ? userBubbleClasses : assistantBubbleClasses} relative`}>
        {(localLoading || message.loading) ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : (
          <ReactMarkdown className="whitespace-pre-line break-words">
            {message.content}
          </ReactMarkdown>
        )}
        {message.role === 'user' && !(localLoading || message.loading) && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute bottom-2 right-2 text-xs text-blue-300 hover:text-blue-200 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
