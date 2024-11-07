import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAssignmentForm from './components/EditForm';

function EditAssignment() {
  const { unique_name } = useParams();
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [points, setPoints] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedReviewees, setSelectedReviewees] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

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
      setSelectedReviewers((prevSelected) =>
        prevSelected.includes(userEmail) ? prevSelected.filter((email) => email !== userEmail) : [...prevSelected, userEmail]
      );
    } else if (type === 'reviewee') {
      setSelectedReviewees((prevSelected) =>
        prevSelected.includes(userEmail) ? prevSelected.filter((email) => email !== userEmail) : [...prevSelected, userEmail]
      );
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      description: body,
      total_points: points,
      deadline,
      reviewers: selectedReviewers,
      reviewees: selectedReviewees,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/assignments/edit-assignment-details/${unique_name}/`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
            'X-CSRFToken': Cookies.get('csrftoken'),
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Assignment updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('Error updating assignment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error updating assignment:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow flex items-center justify-center p-6">
        <EditAssignmentForm
          name={name}
          setName={setName}
          body={body}
          setBody={setBody}
          points={points}
          setPoints={setPoints}
          deadline={deadline}
          setDeadline={setDeadline}
          availableUsers={availableUsers}
          selectedReviewers={selectedReviewers}
          setSelectedReviewers={setSelectedReviewers}
          selectedReviewees={selectedReviewees}
          setSelectedReviewees={setSelectedReviewees}
          handleUserSelect={handleUserSelect}
          handleSubmit={handleSubmit}
        />
      </main>
      <ToastContainer />
    </div>
  );
}

export default EditAssignment;
