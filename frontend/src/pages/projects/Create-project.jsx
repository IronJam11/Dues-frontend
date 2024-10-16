import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main';
import Cookies from 'js-cookie'

function CreateProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null); // State for group image

  // Fetch available users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
          withCredentials: true,
        });
        setAvailableUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle participant selection
  const handleUserSelect = (userEmail) => {
    setSelectedParticipants((prevSelected) =>
      prevSelected.includes(userEmail)
        ? prevSelected.filter((email) => email !== userEmail)
        : [...prevSelected, userEmail]
    );
  };

  // Handle form submission using FormData
  const handleSubmit = async () => {
    const formData = new FormData(); // Create FormData instance

    // Append form fields to FormData
    formData.append('name', name);
    formData.append('description', description);
    formData.append('deadline', deadline);
    formData.append('participant_emails', selectedParticipants);
    
    if (groupImage) {
      formData.append('group_image', groupImage); // Append the image file
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/projects/new-project/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set to multipart/form-data
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      });

      if (response.status === 201 || 200) {
        alert('Project created successfully!');
        const roomname = response.data.roomname;
        
        const roomdata = {
          "room_name": name,
          "participant_emails": selectedParticipants,
          "type": "Group Chat",
          "late_joiner_emails": [],
          "slug": roomname,
        };

        try {
          const responsdata = await axios.post('http://127.0.0.1:8000/chats/groupchat/newproject/room/', roomdata, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
          });
          console.log(responsdata.data);
        } catch (error) {
          console.error('Error creating the room:', error);
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar at the top */}
      <header>
        <Navbar />
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Create New Project</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            />
          </div>

          <div className="mb-4">
            <input
              type="datetime-local"
              placeholder="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Group Image Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-black">Upload Group Image</label>
            <input
              type="file"
              onChange={(e) => setGroupImage(e.target.files[0])} // Update the image state
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-black">Select Participants</label>
            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((user) => (
                <div key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email)}
                    checked={selectedParticipants.includes(user.email)}
                    className="mr-2"
                  />
                  <span className="text-black">{user.name} ({user.email})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Create Project
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateProject;
