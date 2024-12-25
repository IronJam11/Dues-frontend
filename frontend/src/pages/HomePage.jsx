import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoadingPage from '../utilities/LazyLoadingpage';
import UserDetails from '../components/UserDetails';

function Homepage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Track error state
  const [loading, setLoading] = useState(true); // Track loading state
  const [tokensFetched, setTokensFetched] = useState(false); // Track token fetch completion
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');
  const state = query.get('state');

  const fetchAttempted = useRef(false);

  useEffect(() => {
    const setTokensAndFetchUser = async () => {
      console.log("code", code);
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/users/callback/`,
          { code },
          { withCredentials: true }
        );

        console.log(response.data);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        Cookies.set('accessToken', response.data.accessToken, { expires: 7 });
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });

        setTokensFetched(true);
        fetchUserData();
      } catch (error) {
        console.error('Error during authentication:', error);
        setError('Authentication failed');
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      if (fetchAttempted.current) return;
      fetchAttempted.current = true;
      console.log("fetching user data");
      try {
        const token = Cookies.get('accessToken');
        if (token) {
          const checkResponse = await axios.get('http://127.0.0.1:8000/tags/check-user-tags/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
          const response = await axios.get('http://127.0.0.1:8000/users/user-data/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
          console.log("data:-",response.data);
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
        setTokensAndFetchUser();
      } else if (!Cookies.get('accessToken')) {
        setError('No tokens available');
        setLoading(false);
      } else {
        setTokensFetched(true);
        fetchUserData();
      }
    };

    handleTokenSetting();
  }, [code, state]);

  const handleEditClick = () => {
    navigate(`/edit-profile`);
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return tokensFetched && user ? (
    <UserDetails user={user} onEditClick={handleEditClick} />
  ) : null;
}

export default Homepage;
