// // hooks/useAuth.js
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility function to check for expiration
const isTokenExpired = () => {
  const expirationTime = sessionStorage.getItem('tokenExpiration');
  const currentTime = new Date().getTime();

  return expirationTime && currentTime > expirationTime;
};

// Utility function to remove token from sessionStorage
const removeToken = () => {
  sessionStorage.removeItem('jwtToken');
  sessionStorage.removeItem('tokenExpiration');
  sessionStorage.removeItem('enrollmentNo');
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken') ? sessionStorage.getItem('jwtToken') : localStorage.getItem('jwtToken');

    if (token) {
      // Check if the token has expired
      if (isTokenExpired()) {
        console.log("Token has expired");
        removeToken(); // Remove the expired token from storage
        alert("Your session has expired. Please log in again.");
        navigate('/loginpage'); // Redirect to login
      } else {
        console.log("User is authenticated");
        setIsAuthenticated(true);
      }
    } else {
      console.log("User is not authenticated");
      alert("User not authenticated");
      navigate('/loginpage'); // Redirect to login if no token
    }
  }, [navigate]);

  return isAuthenticated; // Return the authentication state
}

