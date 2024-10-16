import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../../utilities/Navbar-main';
import SearchBar from '../../utilities/search-bar'; // Import the SearchBar component
import UserList from './components/UserList'; // Import the UserList component
import UserListAdmin from './components/UserListAdmin'; // Import the UserListAdmin component
import Cookies from 'js-cookie'

function UserProfilesPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // To handle search results
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const isAuthenticated = useAuth(); // Check authentication status

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
        console.log("isadmin:- ", res.data);
        setIsAdmin(res.data['is_admin']); // Set the isReviewer flag based on response
      } catch (err) {
        console.error('Error fetching user details:', err.message);
      }
    };
    

    // Fetch user profiles and admin status from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
        });

        setUsers(response.data.users);
        setFilteredUsers(response.data.users); // Initialize filtered users with all users
        // Set admin status based on the API response
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };
    fetchUserDetails();

    fetchUsers();
  }, [isAuthenticated]);

  const handleSearch = (query) => {
    const searchResults = users.filter((user) =>
      user.enrollmentNo.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.alias.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchResults);
  };

  return isAuthenticated ? (
    <>
      <Navbar /> {/* Include Navbar at the top */}
      <div className="min-h-screen flex flex-col items-center justify-center pt-10">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900">User Profiles</h1>

        {/* SearchBar Component */}
        <SearchBar onSearch={handleSearch} />

        {/* Conditionally render UserList or UserListAdmin based on admin status */}
        {isAdmin ? (
          <UserListAdmin users={filteredUsers} />
        ) : (
          <UserList users={filteredUsers}  />
        )}
      </div>
    </>
  ) : null;
}

export default UserProfilesPage;
