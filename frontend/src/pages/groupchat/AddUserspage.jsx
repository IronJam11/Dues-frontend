import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../utilities/Navbar-main';
import { useAuth } from '../hooks/useAuth';

function AddUsersPage() {
  const { room } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = useAuth()

  useEffect(() => {
    // Fetch all users who are not yet in the group
    if(!isAuthenticated)
    {
      navigate("/loginpage")
      return;
    }
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`
              }
            });
            setUsers(response.data.users);
          } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [room]);

  // Handle selecting/deselecting a user
  const toggleUserSelection = (email) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(email)) {
        return prevSelected.filter((userEmail) => userEmail !== email);
      } else {
        return [...prevSelected, email];
      }
    });
  };

  // Handle adding selected users to the group
  const addUsersToGroup = async () => {
    try {
        console.log({
            users: selectedUsers,
            room_slug: room,
          })
        await axios.post(`http://127.0.0.1:8000/chats/groupchat/add-participants/`, {
            "participant_emails": selectedUsers,
            "room_slug": room,
        });
      // Redirect back to the group chat page
      navigate(-1);
    } catch (error) {
      console.error('Error adding users to group:', error);
    }
  };

  return isAuthenticated && (
    <div className="min-h-screen">
      {/* Include the Navbar at the top */}

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Add Users to Group Chat</h1>
        <div className="mb-6">
          {users.map((user) => (
            <div key={user.email} className="flex justify-between items-center mb-2">
              <span>{user.email}</span>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.email)}
                onChange={() => toggleUserSelection(user.email)}
              />
            </div>
          ))}
        </div>
        <button
          className="px-5 py-3 rounded-lg text-white bg-green-500 hover:bg-green-600"
          onClick={addUsersToGroup}
        >
          Add Selected Users
        </button>
      </div>
    </div>
  );
}

export default AddUsersPage;
