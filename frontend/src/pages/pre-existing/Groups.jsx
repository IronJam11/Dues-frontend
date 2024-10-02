import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; 
import { useParams } from 'react-router-dom';
function Groups() {
  const enrollmentNo1 = useParams();
  const enrollmentNo = enrollmentNo1.enrollmentNo;
  const [groups, setGroups] = useState([]); // Change from users to groups
  const navigate = useNavigate();
  const isAuthenticated = useAuth(); // Check authentication status

//   const enrollmentNo = localStorage.getItem('enrollmentNo'); // Current user's enrollment number
  console.log(enrollmentNo);

  useEffect(() => {
    if (!isAuthenticated) {
      return; // If not authenticated, do not fetch data
    }

    // Fetch group details from the API when the component mounts
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/groupchat/rooms/${enrollmentNo}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}` // Pass the token in the request header
          }
        });
        setGroups(response.data); // Store group data in state
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [isAuthenticated, navigate]);

  const handleGroupClick = (roomName) => {
    if (enrollmentNo) {
      navigate(`/groups/${roomName}/${enrollmentNo}/`);
    }
  };

  return isAuthenticated ? ( // Render only if authenticated
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Choose a group to chat</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => handleGroupClick(group.name)} // Navigate to the room based on group name
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            {group.name} {/* Display group name */}
          </button>
        ))}
      </div>
    </div>
  ) : null; // Do not render anything if not authenticated
}

export default Groups;
