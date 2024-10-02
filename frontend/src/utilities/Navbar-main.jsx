import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchUserDetails = async () => {
    const enrollmentNo = sessionStorage.getItem('enrollmentNo');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/user-info/`, 
        {
          withCredentials: true,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/logout/', {}, { withCredentials: true });
      localStorage.removeItem('jwtToken');
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('enrollmentNo');
      sessionStorage.removeItem('tokenExpiration');
      console.log(response.data);
      navigate('/loginpage');
    } catch (err) {
      console.error('Error during logout:', err.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <div className="text-white text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300 bg-pink-200 text-black px-4 py-2 rounded">
            DUEs
          </Link>
        </div>
        <Link to="/assignments" className="hover:text-gray-300 bg-yellow-200 text-black px-4 py-2 rounded">
          Assignments
        </Link>
        <Link to="/projects" className="hover:text-gray-300 bg-blue-200 text-black px-4 py-2 rounded">
          Projects
        </Link>
        <Link to="/homepage" className="hover:text-gray-300 bg-red-200 text-black px-4 py-2 rounded">
          Homepage
        </Link>
        <Link to="/chatrooms" className="hover:text-gray-300 bg-green-200 text-black px-4 py-2 rounded">
          Chatrooms
        </Link>
        <Link to="/user-profiles" className="hover:text-gray-300 bg-purple-200 text-black px-4 py-2 rounded">
          Users
        </Link>
      </div>
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
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            <div className="py-2">
              <button
                onClick={handleLogout}
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
