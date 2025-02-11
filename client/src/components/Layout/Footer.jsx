import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 text-center text-gray-500 position">
          &copy; {new Date().getFullYear()} Gemini Chatbot. Designed &amp; Developed by{' '}
          <a
            href="https://sibisiddharth8.github.io/portfolio-react/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Sibi Siddharth S
          </a>.
        </footer>
  );
};

export default Footer;
