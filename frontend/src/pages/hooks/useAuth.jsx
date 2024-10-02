import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed

// Utility function to get cookie value by name
const getCookie = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    console.log("Cookies: ", document.cookie);
    const jwtToken = getCookie('jwt'); 

    if (jwtToken) {
      axios.get('http://127.0.0.1:8000/users/check/', {
        withCredentials: true, 
      })
        .then(response => {
          console.log(response.data);
          if (!response.data.valid) {
            console.log("User is authenticated");
            setIsAuthenticated(true);
          } else {
            console.log("Token has expired");
            alert("Your session has expired. Please log in again.");
            setIsAuthenticated(false);
            document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            navigate('/loginpage'); 
          }
        })
        .catch(error => {
          console.error("Error verifying token:", error);
          alert("Error verifying token. Please log in again.");
          setIsAuthenticated(false);
          navigate('/loginpage');
        });
    } else {
      console.log("User is not authenticated");
      alert("User not authenticated");
      setIsAuthenticated(false);
      navigate('/loginpage');
    }
  }, [navigate]);

  return isAuthenticated; // Return the authentication state
}
