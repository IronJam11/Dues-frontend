import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../../utilities/Navbar-main';
import Cookies from 'js-cookie';

function EditAssignment() {
  const { unique_name } = useParams();
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [points, setPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedReviewees, setSelectedReviewees] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/assignments/get-assignment-details/${unique_name}/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
        });

        const assignment = response.data;
        setName(assignment.name);
        setBody(assignment.description);
        setPoints(assignment.total_points);
        setDeadline(assignment.deadline);
        setSelectedReviewers(assignment.reviewers);
        setSelectedReviewees(assignment.reviewees);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      }
    };

    fetchAssignmentDetails();
  }, [unique_name]);

  // Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
        });
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
    // Create the payload as a regular JavaScript object
    const payload = {
      name,
      description: body,
      total_points: points,
      deadline,
      reviewers: selectedReviewers, // Array of reviewer emails
      reviewees: selectedReviewees, // Array of reviewee emails
    };
  
    try {
      const response = await axios.post(
        `http://localhost:8000/assignments/edit-assignment-details/${unique_name}/`,
        payload, // Sending the payload as JSON
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Content-Type': 'application/json', // Ensure the content type is JSON
          },
        }
      );
  
      if (response.status === 200) {
        alert('Assignment updated successfully');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Edit Assignment</h2>

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
            <label className="block mb-2 text-sm font-medium text-black">Select Reviewees</label>
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
              Update Assignment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditAssignment;
