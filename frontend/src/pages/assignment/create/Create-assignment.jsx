import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

function UploadAssignment() {
  const { roomname } = useParams();
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [points, setPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedReviewees, setSelectedReviewees] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [workspaceDetails, setWorkspaceDetails] = useState([]);
  

  // Fetch available users from the API
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/workspaces/workspace-details/${roomname}/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          }
        });
        console.log('PROJECT DETAILS', response.data);
        setWorkspaceDetails(response.data.workspace);
        setAvailableUsers(response.data.workspace.participants);
      } catch (error) {
        console.error('Error fetching project details:', error);
    }
  }
    // const fetchUsers = async () => {
    //   try {
    //     const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
    //       headers: {
    //         Authorization: `Bearer ${Cookies.get('accessToken')}`,
    //       }
    //     });
    //     setAvailableUsers(response.data.users);
    //   } catch (error) {
    //     console.error('Error fetching users:', error);
    //   }
    // };

    // fetchUsers();
    fetchProjectDetails();
  }, []);

  const handleUserSelect = (userEmail, type) => {
    if (type === 'reviewer') {
      setSelectedReviewers((prevSelected) => {
        if (prevSelected.includes(userEmail)) {
          return prevSelected.filter(email => email !== userEmail); // Deselect if already selected
        }
        return [...prevSelected, userEmail]; // Select if not already selected
      });
    } else if (type === 'reviewee') {
      setSelectedReviewees((prevSelected) => {
        if (prevSelected.includes(userEmail)) {
          return prevSelected.filter(email => email !== userEmail); // Deselect if already selected
        }
        return [...prevSelected, userEmail]; // Select if not already selected
      });
    }
  };

  const handleSubmit = async () => {
    const data = {
      name,
      description: body,
      total_points: points,
      deadline: deadline,
      reviewers: selectedReviewers,
      reviewees: selectedReviewees,
      roomname: roomname,
    };

    try {
      const response = await axios.post(`http://localhost:8000/assignments/create-assignment/${roomname}/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}`
        },
      });

      if (response.status === 201) {
        toast.success('Assignment created successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error uploading assignment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error uploading assignment:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl w-full max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-6 text-gradient bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Upload Assignment for {roomname}
          </h2>

          {/* Assignment Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Name</label>
            <input
              type="text"
              placeholder="Enter assignment name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50"
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Describe the assignment"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50 resize-none"
            />
          </div>

          {/* Points and Deadline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Points</label>
              <input
                type="number"
                placeholder="Assignment points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50"
              />
            </div>
          </div>

          {/* Reviewers Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Reviewers</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableUsers.map((user) => (
                <div key={user.email} className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email, 'reviewer')}
                    checked={selectedReviewers.includes(user.email)}
                    className="w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-gray-700">{user.name} ({user.email})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviewees Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Reviewees</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableUsers.map((user) => (
                <div key={user.email} className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email, 'reviewee')}
                    checked={selectedReviewees.includes(user.email)}
                    className="w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-gray-700">{user.name} ({user.email})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-95"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

export default UploadAssignment;
