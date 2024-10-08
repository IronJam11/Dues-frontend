import Cookies from 'js-cookie'
import React from 'react';
import axios from 'axios';
export const handleLogout = async (navigate) => {
  console.log("Before logout, cookies: ", document.cookie);
  
  // Get the refresh token from cookies
  const refreshToken = Cookies.get('refreshToken');
  console.log("refresh token: ", refreshToken);

  try {
    // Send the refresh token in the headers for logout
    const response = await axios.post('http://127.0.0.1:8000/users/logout/', {}, {
      headers: {
        'Authorization1': `Bearer ${refreshToken}` // Send refresh token in the Authorization header
      },
      withCredentials: true, // Ensure cookies are sent with the request
    });

    // Log the response from logout
    console.log("Response from logout:", response.data);
    
    // Remove tokens from cookies
    Cookies.remove('accessToken'); 
    Cookies.remove('refreshToken');
    Cookies.remove('jwt');

    console.log("After logout, cookies: ", document.cookie);
    
    // Navigate to the login page after successful logout
    navigate('/loginpage');

  } catch (err) {
    console.error('Error during logout:', err.message);
  }
};

export default handleLogout;
