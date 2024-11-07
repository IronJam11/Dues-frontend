import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Cookies from 'js-cookie'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (accessToken && refreshToken) {
      axios.get('http://127.0.0.1:8000/users/check/', {
        headers: {
          'Authorization': `${accessToken} ${refreshToken}`,
        }
      })
        .then(response => {
          console.log("token verification response:", response.data);
          if (response.data.valid) {
            // Set new tokens in cookies
            Cookies.set('accessToken', response.data.access_token, { path: '/' });
            Cookies.set('refreshToken', response.data.refresh_token, { path: '/' });
            setIsAuthenticated(true);
          } else {
            console.log("Token has expired");
            setIsAuthenticated(false);
            document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            navigate('/loginpage'); 
          }
        })
        .catch(error => {
          console.error("Error verifying token:", error);
          setIsAuthenticated(false);
          navigate('/loginpage');
        });
    } else {
      console.log("User is not authenticated");
      setIsAuthenticated(false);
      navigate('/loginpage');
    }
  }, [navigate]);

  return isAuthenticated;
}
