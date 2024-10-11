// AssignmentPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; 
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';
import AssignmentsToReview from './assignments-components/AssignemtsToReview';
import AssignmentsToSubmit from './assignments-components/AssignmentsToSubmitcomponent';// Import AssignmentsToSubmit
import SubmittedAssignments from './assignments-components/submittedAssignmentsComponent'; // Import SubmittedAssignments

function AssignmentPage() {
  const [assignmentsToReview, setAssignmentsToReview] = useState([]);
  const [assignmentsToSubmit, setAssignmentsToSubmit] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]); // State for submitted assignments
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  // Fetch assignments to review
  useEffect(() => {
    const fetchAssignmentsToReview = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/assignments/get-all/reviewee/', {
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
        const res = await axios.get('http://127.0.0.1:8000/assignments/get-all/reviewer/', {
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

  // Fetch submitted assignments
  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      try {
        const token = Cookies.get('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/assignments/completed-assignments/', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        console.log(res.data);
        setSubmittedAssignments(res.data.completed_assignments);
      } catch (err) {
        console.error('Error fetching submitted assignments:', err.message);
      }
    };

    fetchSubmittedAssignments();
  }, []);

  // Handle assignment deletion
  const handleDeleteAssignment = (unique_name) => {
    setAssignmentsToReview(assignmentsToReview.filter(assignment => assignment.unique_name !== unique_name));
    setAssignmentsToSubmit(assignmentsToSubmit.filter(assignment => assignment.unique_name !== unique_name));
    setSubmittedAssignments(submittedAssignments.filter(assignment => assignment.unique_name !== unique_name));
  };

  const handleAddSubtasks = (unique_name) => {
    navigate(`${unique_name}/new-subtask`);
  };

  const handleEditAssignment = (unique_name) => {
    console.log(`Edit assignment with ID: ${unique_name}`);
  };

  const handleViewAssignment = (unique_name) => {
    navigate(`${unique_name}/`);
  };

  const handleViewAssignmentReviewer = (unique_name) => {
    navigate(`${unique_name}/reviewer/`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (!isAuthenticated) return null; // Show nothing if the user isn't authenticated

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10">
        <AssignmentsToSubmit
          assignmentsToSubmit={assignmentsToSubmit}
          handleViewAssignment={handleViewAssignment}
          formatDate={formatDate}
        />
        <AssignmentsToReview
          assignmentsToReview={assignmentsToReview}
          handleEditAssignment={handleEditAssignment}
          handleAddSubtasks={handleAddSubtasks}
          handleViewAssignmentReviewer={handleViewAssignmentReviewer}
          handleDeleteAssignment={handleDeleteAssignment}
          formatDate={formatDate}
        />
        <SubmittedAssignments
          submittedAssignments={submittedAssignments}
          handleViewAssignment={handleViewAssignment}
        />
      </div>
    </div>
  );
}

export default AssignmentPage;
