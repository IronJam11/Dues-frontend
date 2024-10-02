import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from '../utilities/Navbar-main';

function Homepage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const jwtToken = sessionStorage.getItem('jwtToken') ? sessionStorage.getItem('jwtToken') : localStorage.getItem('jwtToken');
  const enrollmentNo = sessionStorage.getItem('enrollmentNo') ? sessionStorage.getItem('enrollmentNo') : localStorage.getItem('enrollmentNo');
  

  useEffect(() => {
    if (!isAuthenticated) {
      return; // If not authenticated, do not fetch data
    }


    // Fetch user details from the API
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/user-info/`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${jwtToken}` // Attach JWT token as a Bearer token
          } // Ensure cookies are sent with the request
        });
        setUser(response.data); // Assuming the response contains the user object
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [isAuthenticated, jwtToken]); // changes if isAuthenticated or jwtToken is updated

  const handleChatClick = () => {
    if (user && user.enrollmentNo) {
      navigate(`/${enrollmentNo}/${user.enrollmentNo}`);
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

// Helper function to get the JWT from cookies
// const getCookie = (cookieName) => {
//   const name = cookieName + "=";
//   const decodedCookie = decodeURIComponent(document.cookie);
//   const cookieArray = decodedCookie.split(';');
//   for (let i = 0; i < cookieArray.length; i++) {
//     let cookie = cookieArray[i].trim();
//     if (cookie.indexOf(name) === 0) {
//       return cookie.substring(name.length, cookie.length);
//     }
//   }
//   return "";
// };

export default Homepage;
