import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/api';
import Footer from '../components/Layout/Footer';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // For authenticated users, fetch the default chat.
      const fetchDefaultChat = async () => {
        try {
          const res = await axios.get(`${api.endpoint}/api/chat`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.length > 0) {
            // Redirect to the first available chat.
            navigate(`/chat/${res.data[0]._id}`);
          } else {
            // Create a new default chat if none exist.
            const newChatRes = await axios.post(
              `${api.endpoint}/api/chat`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/chat/${newChatRes.data._id}`);
          }
        } catch (error) {
          console.error(error);
          // If unauthorized, redirect to login.
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDefaultChat();
    } else {
      // No token means the user is not authenticated.
      setLoading(false);
    }
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-200">
        Loading...
      </div>
    );
  }

  // If no token is available, show a polished landing page.
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
        {/* Header / Hero Section with extra top padding to clear the fixed navbar */}
        <header className="pt-28 pb-12 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-400 mb-4">
            Welcome to Zbot
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Experience intelligent, context-aware conversations.
          </p>
        </header>
        {/* Main Call-to-Action */}
        <main className="flex-grow flex flex-col items-center justify-center px-4">
          <h2 className="text-xl sm:text-3xl font-semibold mb-6">
            Revolutionize Your Conversations
          </h2>
          <p className="text-sm sm:text-base text-center max-w-2xl mb-8">
            Gemini Chatbot uses advanced AI to generate responses based on context,
            offering you a seamless chat experience. Sign in now to start chatting, or register to join our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white py-3 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-white py-3 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Register
            </button>
          </div>
        </main>
        {/* Footer */}
        <Footer />
        
      </div>
    );
  }

  return null; // When token exists, the redirect happens automatically.
};

export default Home;
