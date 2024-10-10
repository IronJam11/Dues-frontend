import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../utilities/Navbar-main'; // Adjust the import path if necessary
import Cookies from 'js-cookie'

function UploadAssignment() {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [points, setPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedReviewees, setSelectedReviewees] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Fetch available users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
            withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          }
        });
        console.log(response.data)
        setAvailableUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userEmail, type) => {
    if (type === 'reviewer') {
      setSelectedReviewers(prevSelected =>
        prevSelected.includes(userEmail)
          ? prevSelected.filter(email => email !== userEmail)
          : [...prevSelected, userEmail]
      );
    } else if (type === 'reviewee') {
      setSelectedReviewees(prevSelected =>
        prevSelected.includes(userEmail)
          ? prevSelected.filter(email => email !== userEmail)
          : [...prevSelected, userEmail]
      );
    }
  };

  const handleSubmit = async () => {
    // Prepare the JSON data
    const data = {
      name,
      description: body,
      total_points: points,
      deadline: deadline,
      reviewers: selectedReviewers,
      reviewees: selectedReviewees,
    };
    console.log(data);

    try {
      // Make the POST request
      const response = await axios.post('http://localhost:8000/assignments/create-assignment/', data, {
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${Cookies.get('accessToken')}`
        },
      });

      if (response.status === 201) {
        alert('Assignment created successfully');
      }
    } catch (error) {
      console.error('Error uploading assignment:', error);
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
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Upload Assignment</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Assignment Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Assignment Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              placeholder="Points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-black">Select Reviewers</label>
            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((user) => (
                <div key={user.email} className="flex items-center">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email, 'reviewer')}
                    checked={selectedReviewers.includes(user.email)}
                    className="mr-2"
                  />
                  <span className="text-black">{user.name} ({user.email})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-black">Select Reviewews</label>
            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((user) => (
                <div key={user.email} className="flex items-center">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email, 'reviewee')}
                    checked={selectedReviewees.includes(user.email)}
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
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UploadAssignment;
