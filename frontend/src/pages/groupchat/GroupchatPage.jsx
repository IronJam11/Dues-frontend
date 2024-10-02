import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function CreateRoomPage() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/all-users/', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  const handleUserSelect = (userEmail) => {
    if (selectedUsers.includes(userEmail)) {
      setSelectedUsers(selectedUsers.filter((email) => email !== userEmail));
    } else {
      setSelectedUsers([...selectedUsers, userEmail]);
    }
  };

  const handleCreateRoom = async () => {
    if (roomName.trim() !== '' && selectedUsers.length > 0) {
      const roomData = {
        name: roomName,
        participants: selectedUsers
      };
      console.log(roomData);

      try {
        const response = await axios.post('http://127.0.0.1:8000/groupchat/create-room/', roomData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
          }
        });

        if (response.status >= 200 && response.status < 300) {
          alert('Room created successfully');
          navigate(`/${roomName}`);
        }
      } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to create room.');
      }
    } else {
      alert('Please enter a room name and select at least one participant.');
    }
  };

  return isAuthenticated ? (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Create a New Chat Room</h1>

      <div className="w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={user.enrollmentNo}
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={selectedUsers.includes(user.email)}
              onChange={() => handleUserSelect(user.email)}
            />
            <label htmlFor={user.enrollmentNo} className="text-lg text-gray-900">
              {user.email}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleCreateRoom}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Create Room
      </button>
    </div>
  ) : null;
}

export default CreateRoomPage;
