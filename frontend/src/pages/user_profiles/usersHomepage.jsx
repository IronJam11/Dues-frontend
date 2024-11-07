import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../../contexts/WebSocketContext'; // Import the useWebSocket hook
import Navbar from '../../utilities/Navbar-main';
import SearchBar from '../../utilities/search-bar'; // Import the SearchBar component
import UserList from './components/UserList'; // Import the UserList component
import UserListAdmin from './components/UserListAdmin'; // Import the UserListAdmin component
import Cookies from 'js-cookie';

function UserProfilesPage() {
  const [filteredUsers, setFilteredUsers] = useState([]); // To handle search results
  const [userDetails, setUserDetails] = useState(false); // State to track if the user is an admin
  const isAuthenticated = useAuth(); // Check authentication status
  const { allUsers } = useWebSocket(); // Get allUsers from the WebSocket context

  useEffect(() => {
    if (!isAuthenticated) {
      return; // If not authenticated, do not fetch data
    }

    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/users/user-data/', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserDetails(res.data);// Set user details (admin status)
      } catch (err) {
        console.error('Error fetching user details:', err.message);
      }
    };

    fetchUserDetails();
  }, [isAuthenticated]);

  useEffect(() => {
    
    setFilteredUsers(allUsers);
  }, [allUsers]);

  const handleSearch = (query) => {
    const searchResults = allUsers.filter((user) =>
      user.enrollmentNo.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.alias.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchResults);
  };

  return isAuthenticated ? (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center pt-10">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900">User Profiles</h1>

        {/* SearchBar Component */}
        <SearchBar onSearch={handleSearch} />

        {/* Conditionally render UserList or UserListAdmin based on admin status */}
        {userDetails.is_admin ? (
          <UserList users={filteredUsers} />
        ) : (
          <UserList users={filteredUsers} />
        )}
      </div>
    </>
  ) : null;
}

export default UserProfilesPage;
