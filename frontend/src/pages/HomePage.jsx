import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../utilities/Navbar-main';
import Cookies from 'js-cookie';

function Homepage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Track error state
  const [loading, setLoading] = useState(true); // Track loading state
  const [tokensFetched, setTokensFetched] = useState(false); // Track token fetch completion
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');
  const state = query.get('state');

  // Ref to track if user data fetch has already been attempted
  const fetchAttempted = useRef(false);

  useEffect(() => {
    const setTokensAndFetchUser = async () => {
      console.log("code", code);
      try {
        // Make a request to your backend to exchange code for tokens
        const response = await axios.post(
          `http://127.0.0.1:8000/users/callback/`,
          { code }, // Send the code in the request body
          { withCredentials: true } // Send cookies along with the request
        );

        console.log(response.data);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
 
        // Set the access token and refresh token in cookies
        Cookies.set('accessToken', response.data.accessToken, { expires: 7 });
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });

        setTokensFetched(true); // Mark token fetching as done
        fetchUserData(); // Fetch user data after setting tokens
      } catch (error) {
        console.error('Error during authentication:', error);
        setError('Authentication failed');
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      if (fetchAttempted.current) return; // Prevent multiple fetch attempts
      fetchAttempted.current = true; // Mark fetch attempt
      console.log("fetching user data");
      try {
        const token = Cookies.get('accessToken'); // Read token from cookies
        if (token) {
          // Fetch user details from the new API endpoint
          const checkResponse = await axios.get('http://127.0.0.1:8000/tags/check-user-tags/', {
            headers: {
              Authorization: `Bearer ${token}`, // Send token as a header
            },
            withCredentials: true,
          });
          const response = await axios.get('http://127.0.0.1:8000/tags/user-details-tags/', {
            headers: {
              Authorization: `Bearer ${token}`, // Send token as a header
            },
            withCredentials: true,
          });
          console.log(checkResponse.data);
          setUser(response.data);
        } else {
          setError('Token not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    const handleTokenSetting = async () => {
      if (code && state) {
        // Attempt to set tokens and fetch user data
        setTokensAndFetchUser();
      } else if (!Cookies.get('accessToken')) {
        // No code/state and no tokens, show an error
        setError('No tokens available');
        setLoading(false);
      } else {
        // Tokens already exist, fetch user data
        setTokensFetched(true); // Mark tokens fetched
        fetchUserData();
      }
    };

    handleTokenSetting(); // Always call this first to handle the flow
  }, [code, state]);

 

  const handleEditClick = () => {
    navigate(`/edit-profile`);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return tokensFetched && user ? (
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
          <p className="text-black mb-6">Points: {user.points}</p> {/* Display user points */}
          <p className="text-black mb-6">Streak: {user.streak ? user.streak : 1}</p> {/* Display user points */}
          <div className="flex flex-wrap justify-center mb-4">
            {user.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center justify-center m-2 p-2 rounded-lg"
                style={{ backgroundColor: tag.color }}
              >
                <span className="text-white">{tag.name}</span> {/* Display tag name */}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4">
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
