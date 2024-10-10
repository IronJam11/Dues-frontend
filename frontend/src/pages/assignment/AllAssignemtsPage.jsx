import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; 
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';
import DeleteAssignment from '../../functions/handleDeleteAssignment'; // Import the DeleteAssignment component

function AssignmentPage() {
  const [assignmentsToReview, setAssignmentsToReview] = useState([]);
  const [assignmentsToSubmit, setAssignmentsToSubmit] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  // Fetch assignments to review
  useEffect(() => {
    const fetchAssignmentsToReview = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get(`http://127.0.0.1:8000/assignments/get-all/reviewee/`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        setAssignmentsToSubmit(res.data.assignments);
      } catch (err) {
        console.error('Error fetching assignments to review:', err.message);
      }
    };

    fetchAssignmentsToReview();
  }, []);

  // Fetch assignments to submit
  useEffect(() => {
    const fetchAssignmentsToSubmit = async () => {
      try {
        const token = Cookies.get('accessToken');
        console.log(token);
        const res = await axios.get(`http://127.0.0.1:8000/assignments/get-all/reviewer/`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        setAssignmentsToReview(res.data.assignments);
      } catch (err) {
        console.error('Error fetching assignments to submit:', err.message);
      }
    };

    fetchAssignmentsToSubmit();
  }, []);

  // Navigate to the create assignment page
  const handleCreateAssignment = () => {
    navigate('/createAssignment');
  };

  // Format deadline in a user-friendly way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  // Handle assignment deletion
  const handleDeleteAssignment = (unique_name) => {
    setAssignmentsToReview(assignmentsToReview.filter(assignment => assignment.unique_name !== unique_name));
    setAssignmentsToSubmit(assignmentsToSubmit.filter(assignment => assignment.unique_name !== unique_name));
  };

  const handleAddSubtasks = (unique_name) => {
    console.log(`Add subtasks to assignment with ID: ${unique_name}`);
    navigate(`${unique_name}/new-subtask`);
  };

  const handleEditAssignment = (unique_name) => {
    console.log(`Edit assignment with ID: ${unique_name}`);
  };

  const handleViewAssignment = (unique_name) => {
    navigate(`${unique_name}`);
  };

  const handleViewAssignmentReviewer = (unique_name) => {
    navigate(`${unique_name}`);
  };

  return isAuthenticated ? (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header>
        <Navbar /> {/* Include the Navbar */}
      </header>

      <main className="container mx-auto mt-10 flex-1 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Assignments</h1>
          <button
            onClick={handleCreateAssignment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Assignment
          </button>
        </div>
        
        {/* Section for Assignments to Review */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-black">Assignments to Review</h2>
          {assignmentsToReview.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignmentsToReview.map(assignment => (
                <div
                  key={assignment.unique_name} 
                  className="bg-white shadow-md p-6 rounded-xl text-black"
                >
                  <h3 className="text-xl font-semibold">{assignment.name}</h3>
                  <p>{assignment.description}</p>
                  <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-between">
                    <button
                      onClick={() => handleEditAssignment(assignment.unique_name)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded mb-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAddSubtasks(assignment.unique_name)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded mb-2"
                    >
                      Add Subtasks
                    </button>
                    <button
                      onClick={() => handleViewAssignmentReviewer(assignment.unique_name)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-2"
                    >
                      View
                    </button>
                    <DeleteAssignment 
                      unique_name={assignment.unique_name} 
                      onDelete={handleDeleteAssignment} // Pass the delete handler
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No assignments to review found.</p>
          )}
        </section>

        {/* Section for Assignments to Submit */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Assignments to Submit</h2>
          {assignmentsToSubmit.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignmentsToSubmit.map(assignment => (
                <div
                  key={assignment.unique_name}
                  className="bg-white shadow-md p-6 rounded-xl text-black"
                >
                  <h3 className="text-xl font-semibold">{assignment.name}</h3>
                  <p>{assignment.description}</p>
                  <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-between">
                    <button
                      onClick={() => handleViewAssignment(assignment.unique_name)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/submit-assignment/${assignment.unique_name}`)}
                      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded mb-2"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No assignments to submit found.</p>
          )}
        </section>
      </main>

      <style jsx>{`
        @media (max-width: 768px) {
          .flex-wrap {
            flex-direction: column;
          }
          .flex-wrap > button {
            width: 100%;
            margin-bottom: 0.5rem; 
          }
        }
      `}</style>
    </div>
  ) : null;
}

export default AssignmentPage;
