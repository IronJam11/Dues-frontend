import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; // Assuming the Navbar is in the same folder
import { useAuth } from '../hooks/useAuth';

function AssignmentPage() {
  const [assignmentsToReview, setAssignmentsToReview] = useState([]);
  const [assignmentsToSubmit, setAssignmentsToSubmit] = useState([]);
  const navigate = useNavigate();
  const enrollmentNo = sessionStorage.getItem('enrollmentNo');
  const isAuthenticated = useAuth();

  useEffect(() =>
  {
    if(!isAuthenticated)
      return;
  })

  // Fetch assignments to review
  useEffect(() => {
    if(!isAuthenticated) return;
    const fetchAssignmentsToReview = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/assignments/get-all/reviewee/${enrollmentNo}/`, {
          withCredentials: true // Ensure the request includes cookies/JWT
        });
        setAssignmentsToReview(res.data.assignments);
      } catch (err) {
        console.error('Error fetching assignments to review:', err.message);
      }
    };

    fetchAssignmentsToReview();
  }, []);

  // Fetch assignments to submit
  useEffect(() => {
    if(!isAuthenticated) return;
    const fetchAssignmentsToSubmit = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/assignments/get-all/reviewer/${enrollmentNo}/`, {
          withCredentials: true // Ensure the request includes cookies/JWT
        });
        setAssignmentsToSubmit(res.data.assignments);
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

  // Handle button actions
  const handleDeleteAssignment = async (unique_name) => {
    console.log(`Delete assignment with ID: ${unique_name}`);
    if(!isAuthenticated) return;
    const delete_response = await axios.delete(`http://127.0.0.1:8000/assignments/delete/${unique_name}/`);
    console.log(delete_response.data);
    alert("Assignment was successfully deleted!");
    setAssignmentsToReview(assignmentsToReview.filter(assignment => assignment.unique_name !== unique_name));
    setAssignmentsToSubmit(assignmentsToSubmit.filter(assignment => assignment.unique_name !== unique_name));
    // Add delete functionality here
  };

  const handleAddSubtasks = (unique_name) => {
    console.log(`Add subtasks to assignment with ID: ${unique_name}`);
    navigate(`${unique_name}/new-subtask`);
    // Add subtasks functionality here
  };

  const handleEditAssignment = (unique_name) => {
    console.log(`Edit assignment with ID: ${unique_name}`);
    // Add edit functionality here
  };
  const handleViewAssignment = (unique_name) =>{
    navigate(`${unique_name}`)
  }
  const handleViewAssignmentReviewer = (unique_name) =>{
    navigate(`/reviewer/${unique_name}`)
  }

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
          key={assignment.unique_name} // Using unique_name for the key
          className="bg-white shadow-md p-6 rounded-xl text-black"
        >
          <h3 className="text-xl font-semibold">{assignment.name}</h3>
          <p>{assignment.description}</p>
          <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => handleEditAssignment(assignment.unique_name)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleAddSubtasks(assignment.unique_name)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Add Subtasks
            </button>
            <button
              onClick={() => handleViewAssignmentReviewer(assignment.unique_name)} // Navigate to view page
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View
            </button>
            <button
              onClick={() => handleDeleteAssignment(assignment.unique_name)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
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
          key={assignment.unique_name} // Using unique_name for the key
          className="bg-white shadow-md p-6 rounded-xl text-black"
        >
          <h3 className="text-xl font-semibold">{assignment.name}</h3>
          <p>{assignment.description}</p>
          <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

          {/* Action Buttons */}
          <div className="flex space-x-2"> {/* Buttons are close to each other with gap */}
            <button
              onClick={() => handleViewAssignment(assignment.unique_name)} // Navigate to view page
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View
            </button>
            <button
              onClick={() => navigate(`/submit-assignment/${assignment.unique_name}`)} // Navigate to submit page
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
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
    </div>
  ): null;
}

export default AssignmentPage;
