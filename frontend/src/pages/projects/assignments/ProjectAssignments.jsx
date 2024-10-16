import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // For navigation and getting params
import Navbar from '../../../utilities/Navbar-main'; // Adjust the import if necessary
import Cookies from 'js-cookie';

function ProjectAssignmentsPage() {
  const { roomname } = useParams(); // Get roomname from the URL
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the assignments for the project
    const fetchAssignments = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`http://127.0.0.1:8000/projects/assignments/${roomname}/`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAssignments(response.data.assignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [roomname]);

  // Handle navigation to the add assignment page
  const handleAddAssignment = () => {
    navigate(`/projects/${roomname}/add-assignment`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-start">
        <div className="max-w-4xl w-full mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Assignments for Project {roomname}</h2>

          {/* Add Assignment button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAddAssignment}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Add Assignment
            </button>
          </div>

          {assignments.length === 0 ? (
            <p className="text-center text-gray-600">No assignments found for this project.</p>
          ) : (
            <ul className="space-y-4">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="p-4 border border-gray-300 rounded-lg">
                  <h3 className="text-lg font-bold text-black">{assignment.name}</h3>
                  <p className="text-sm text-gray-600">{assignment.description}</p>
                  <p className="text-sm text-gray-600">Total Points: {assignment.total_points}</p>
                  <p className="text-sm text-gray-600">Deadline: {new Date(assignment.deadline).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProjectAssignmentsPage;
