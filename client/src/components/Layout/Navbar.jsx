import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl text-blue-400">🤖</span>
          <Link to="/" className="text-2xl font-bold text-blue-400">
            Zbot
          </Link>
        </div>
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {token ? (
            <>
              <button
                onClick={handleLogout}
                className="text-base text-gray-300 hover:text-blue-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-base text-gray-300 hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-base text-gray-300 hover:text-blue-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
