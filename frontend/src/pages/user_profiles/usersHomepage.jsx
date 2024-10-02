import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../../utilities/Navbar-main';
import SearchBar from '../../utilities/search-bar';// Import the SearchBar component

function UserProfilesPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // To handle search results
  const navigate = useNavigate();
  const isAuthenticated = useAuth(); // Check authentication status

  const enrollmentNo = sessionStorage.getItem('enrollmentNo');

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("USER NOT AUTHENTICATED");
      return; // If not authenticated, do not fetch data
    }

    // Fetch user profiles from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setUsers(response.data.users);
        setFilteredUsers(response.data.users); // Initialize filtered users with all users
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };

    fetchUsers();
  }, [isAuthenticated, navigate]); // re-run if isAuthenticated or navigate changes

  const handleChatClick = (userEnrollmentNo) => {
    if (enrollmentNo) {
      navigate(`/${enrollmentNo}/${userEnrollmentNo}`);
    }
  };

  const handleSearch = (query) => {
    const searchResults = users.filter(user =>
      user.enrollmentNo.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.alias.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchResults);
  };

  return isAuthenticated ? (
    <>
      <Navbar /> {/* Include Navbar at the top */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 pt-10">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900">User Profiles</h1>
        
        {/* SearchBar Component */}
        <SearchBar onSearch={handleSearch} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl mt-6">
          {filteredUsers.map((user) => (
            <div key={user.enrollmentNo} className="bg-white p-6 rounded-lg shadow-lg text-center">
              <img
                src={`http://127.0.0.1:8000${user.profilePicture}`} // Correctly using template literals
                alt={`${user.name}'s profile`}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-black mb-2">{user.name}</h2>
              <p className="text-black mb-4">@{user.alias}</p>
              <p className="text-black mb-6">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
              <button
                onClick={() => handleChatClick(user.enrollmentNo)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : null;
}

export default UserProfilesPage;
