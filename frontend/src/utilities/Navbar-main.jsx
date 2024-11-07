import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogout } from '../functions/handleLogout';
import { fetchUserDetails } from '../functions/fetchUserDetails';
import { motion } from 'framer-motion'; // Import framer-motion

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUserDetails(setUser);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center transition-colors duration-300">
      <motion.div
        className="flex items-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <motion.div
          className="text-white text-4xl font-extrabold"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Link to="/" className="hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300">
            DUES
          </Link>
        </motion.div>
      </motion.div>

      {/* Hamburger Menu for small screens */}
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <svg
            className="w-6 h-6 transition-transform duration-300 transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out bg-purple-700 w-64 z-30 md:hidden shadow-lg`}
      >
        <div className="p-6">
          <button onClick={toggleSidebar} className="text-white focus:outline-none mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <nav className="space-y-4">
            {["assignments", "projects", "homepage", "user-profiles"].map((route) => (
              <Link
                to={`/${route}`}
                key={route}
                className="block text-white hover:bg-purple-600 px-4 py-2 rounded transition duration-300"
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Regular Navigation Links (Visible on Medium and Large Screens) */}
      <div className="hidden md:flex space-x-8 items-center">
        {["assignments", "projects", "homepage", , "user-profiles", "leaderboard", "tags", "ideas"].map((route) => (
          <Link
            to={`/${route}`}
            key={route}
            className="hover:bg-purple-700 text-white px-4 py-2 rounded transition duration-300"
          >
            {route.charAt(0).toUpperCase() + route.slice(1)}
          </Link>
        ))}
      </div>

      {/* Profile Section */}
      <div className="relative flex items-center ml-auto space-x-4">
        <div
          className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center cursor-pointer ${
            user && user.profilePicture ? '' : 'bg-gray-400'
          }`}
          onClick={toggleDropdown}
        >
          {user && user.profilePicture ? (
            <img
              src={`http://127.0.0.1:8000${user.profilePicture}`}
              alt="Profile"
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="text-white">P</span>
          )}
        </div>
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg z-20 transform transition-opacity duration-300 opacity-100"
          >
            <div className="py-2">
              <Link
                to="/analytics"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition duration-300"
              >
                Analytics
              </Link>
              <button
                onClick={() => handleLogout(navigate)}
                className="block px-4 py-2 text-red-600 hover:bg-gray-200 w-full text-left transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
