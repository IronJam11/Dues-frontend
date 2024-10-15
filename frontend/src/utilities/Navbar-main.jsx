import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleLogout } from '../functions/handleLogout';
import { fetchUserDetails } from '../functions/fetchUserDetails';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);  // Ref for dropdown

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
        setDropdownOpen(false);  // Close dropdown if clicked outside
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
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
            DUES
          </Link>
        </div>
      </div>

      {/* Hamburger Menu for small screens */}
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-800 w-64 z-30 md:hidden`}>
        <div className="p-6">
          <button onClick={toggleSidebar} className="text-white focus:outline-none mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <nav className="space-y-4">
            <Link to="/assignments" className="block text-white hover:bg-gray-700 px-4 py-2 rounded">
              Assignments
            </Link>
            <Link to="/projects" className="block text-white hover:bg-gray-700 px-4 py-2 rounded">
              Projects
            </Link>
            <Link to="/homepage" className="block text-white hover:bg-gray-700 px-4 py-2 rounded">
              Homepage
            </Link>
            <Link to="/chatrooms" className="block text-white hover:bg-gray-700 px-4 py-2 rounded">
              Chatrooms
            </Link>
            <Link to="/user-profiles" className="block text-white hover:bg-gray-700 px-4 py-2 rounded">
              Users
            </Link>
          </nav>
        </div>
      </div>

      {/* Regular Navigation Links (Visible on Medium and Large Screens) */}
      <div className="hidden md:flex space-x-8 items-center">
        <Link to="/assignments" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Assignments
        </Link>
        <Link to="/projects" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Projects
        </Link>
        <Link to="/homepage" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Homepage
        </Link>
        <Link to="/chatrooms" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Chatrooms
        </Link>
        <Link to="/user-profiles" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Users
        </Link>
        <Link to="/leaderboard" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Leaderboard
        </Link>
        <Link to="/tags" className="hover:bg-gray-700 text-white px-4 py-2 rounded">
          Tags
        </Link>
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
            className="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg z-20"
          >
            <div className="py-2">
              <Link
                to="/analytics"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Analytics
              </Link>
              <button
                onClick={() => handleLogout(navigate)}
                className="block px-4 py-2 text-red-600 hover:bg-gray-200 w-full text-left"
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
