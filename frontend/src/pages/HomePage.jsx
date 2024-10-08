import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../utilities/Navbar-main';
import Cookies from 'js-cookie';

function Homepage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = true; // Assume authentication state
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');
  const state = query.get('state');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return; // Skip fetching user data if not authenticated

      try {
        const token = Cookies.get('accessToken'); // Read token from cookies
        if (token) {
          // Fetch user details from the API
          const response = await axios.get('http://127.0.0.1:8000/users/user-data/', {
            headers: {
              'Authorization': `Bearer ${token}`, // Send token as a header
            },
            withCredentials: true, // Keep this if you're still sending CSRF or session cookies
          });

          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Check if both accessToken and refreshToken cookies exist
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (accessToken && refreshToken) {
      // If both tokens exist, fetch user data directly
      fetchUserData();
    } else if (code && state) {
      // If code and state are present, set tokens and fetch user data
      const setTokensAndFetchUser = async () => {
        try {
          // Make a request to your backend to exchange code for tokens
          const response = await axios.get(`http://127.0.0.1:8000/users/callback/?code=${code}&state=${state}`, {
            withCredentials: true, // Keep this if you're still sending CSRF or session cookies
          });

          // Set the access token and refresh token in cookies
          console.log(response.data);
          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;

          Cookies.set('accessToken', accessToken, { expires: 7 }); // Set cookie for 7 days
          Cookies.set('refreshToken', refreshToken, { expires: 7 }); // Set cookie for 7 days

          // Fetch user details after setting cookies
          await fetchUserData(); // Call fetchUserData to update user state
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      };

      setTokensAndFetchUser();
    } else {
      fetchUserData(); // Fetch user data if no code/state
    }
  }, [code, state, isAuthenticated]);

  const handleChatClick = () => {
    if (user && user.enrollmentNo) {
      navigate(`/${user.enrollmentNo}/${user.enrollmentNo}`);
    }
  };

  const handleEditClick = () => {
    navigate(`/edit-profile`);
  };

  return isAuthenticated && user ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 pt-10">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Profile of {user.name}</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <img
            src={`http://127.0.0.1:8000${user.profilePicture}`}
            alt={`${user.name}'s profile`}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-black mb-2">{user.name}</h2>
          <p className="text-black mb-4">@{user.alias}</p>
          <p className="text-black mb-6">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleChatClick}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
            >
              Chat with this user
            </button>
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;
}

export default Homepage;
