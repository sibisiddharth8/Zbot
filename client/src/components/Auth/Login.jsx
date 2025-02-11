import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/api';
import Footer from '../Layout/Footer';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${api.endpoint}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (error) {
      setError(error.response?.data.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between px-4 pt-24">
      <div className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back! 👋</h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2">
            Sign in to continue your conversation with Gemini Chatbot.
          </p>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-1 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 text-white py-2 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
