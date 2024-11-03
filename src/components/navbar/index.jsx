import React from 'react';
import { Link } from 'react-router-dom';

const index = () => {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-semibold text-blue-400">ColorWizz</div>

        {/* Buttons */}
        <div className="space-x-4">
          <Link to="/signin" className="px-4 py-2 bg-transparent border border-blue-400 text-blue-400 rounded-md hover:bg-blue-400 hover:text-white transition duration-200">
            Sign In
          </Link>
          <Link to="signup" className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-200">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default index;
