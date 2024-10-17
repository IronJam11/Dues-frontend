// src/contexts/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Create the WebSocket context
const WebSocketContext = createContext(null);

// WebSocket provider component
export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null); // Use ref to persist the WebSocket connection
  const [allUsers, setAllUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(); // State to track the user's details

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setAllUsers(res.data.users); // Set all users data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const setupWebSocket = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/users/user-data/', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserDetails(res.data); // Set user's details

        // Only set up WebSocket connection if userDetails are successfully fetched
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const socketUrl = `${protocol}://${window.location.hostname}:8000/status/ws/status/${res.data.enrollmentNo}/`;
        console.log(socketUrl);

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
          console.log('WebSocket connection established');
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message:', data);

          // Update the status of the user in the allUsers state
          if (data.type === 'status_update') {
            setAllUsers((prevUsers) =>
              prevUsers.map(user =>
                user.enrollmentNo === data.enrollmentNo
                  ? { ...user, status: data.status }
                  : user
              )
            );
          }
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.current.onclose = (event) => {
          console.log('WebSocket connection closed', event);
        };
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchAllUsers(); // Fetch all users when the component mounts
    setupWebSocket(); // Set up the WebSocket connection only after fetching user data

    // Cleanup WebSocket connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []); // Re-run if userDetails changes

  return (
    <WebSocketContext.Provider value={{ ws: ws.current, allUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
