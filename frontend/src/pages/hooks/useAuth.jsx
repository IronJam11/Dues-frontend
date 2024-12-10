import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  // Add loading state
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
          console.log("Token verification response:", response.data);
          if (response.data.valid) {
            if (response.data.access_token && response.data.refresh_token) {
              Cookies.set('accessToken', response.data.access_token);
              Cookies.set('refreshToken', response.data.refresh_token);
            }
            setIsAuthenticated(true);
          } else {
            console.log("Token has expired");
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            navigate('/loginpage');
          }
        })
        .catch(error => {
          console.error("Error verifying token:", error);
          Cookies.remove('accessToken', { path: '/' });
          Cookies.remove('refreshToken', { path: '/' });
          navigate('/loginpage');
        })
        .finally(() => {
          setIsLoading(false);  // Set loading to false after check completes
        });
    } else {
      console.log("User is not authenticated");
      setIsAuthenticated(false);
      setIsLoading(false);  // Set loading to false if no tokens
      navigate('/loginpage');
    }
  }, [navigate]);

  return { isAuthenticated, isLoading };
}
