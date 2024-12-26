import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const AddUsersToWorkspace = () => {
  const { roomname } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users not in the workspace based on search query
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/workspaces/add-users-search/${roomname}/`, {
        params: { query: searchQuery },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });
      console.log(response.data);
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserToggle = (enrollmentNo) => {
    setSelectedUsers((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(enrollmentNo)) {
        updatedSelected.delete(enrollmentNo);
      } else {
        updatedSelected.add(enrollmentNo);
      }
      return updatedSelected;
    });
  };

  // Handle form submission to add selected users to the workspace
  const handleAddUsers = async () => {
    console.log({
      roomname,
      enrollmentNos: Array.from(selectedUsers),
    })
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/workspaces/add-users/`,
        {
          roomname,
          enrollmentNos: Array.from(selectedUsers),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      console.log('Users added:', response.data);
      navigate(`/workspace/${roomname}`);
    } catch (error) {
      console.error('Error adding users:', error);
    }
  };

  // Fetch users on component load and whenever searchQuery changes
  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Add Users to Workspace</h1>
        
        <input
          type="text"
          placeholder="Search users..."
          className="border border-gray-300 p-2 mb-6 w-full rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.enrollmentNo}
                className={`border p-4 rounded-lg shadow-lg flex flex-col items-center ${
                  selectedUsers.has(user.enrollmentNo) ? 'bg-blue-100' : 'bg-white'
                }`}
                onClick={() => handleUserToggle(user.enrollmentNo)}
              >
                <img
                  src={`http://127.0.0.1:8000${user.profilePicture}`|| '/default-profile.png'}
                  alt={user.name}
                  className="w-24 h-24 object-cover rounded-full mb-4"
                />
                <p className="text-lg font-bold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.alias}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.enrollmentNo}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAddUsers}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
          disabled={selectedUsers.size === 0}
        >
          Add Selected Users
        </button>
      </div>
    </div>
  );
};

export default AddUsersToWorkspace;
