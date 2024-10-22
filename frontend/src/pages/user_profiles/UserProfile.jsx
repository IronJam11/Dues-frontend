import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; // Import Navbar
import Cookies from 'js-cookie';

function UserDetailPage() {
  const { enrollmentNo } = useParams(); 
  const [userDetails, setUserDetails] = useState(null);
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchCurrentUserDetails = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/users/user-data/`,
            {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${Cookies.get("accessToken")}`
              }
            }
          );
          setCurrentUserDetails(response.data);
        } catch (err) {
          setError('Error fetching user details.');
          console.error(err.message);
        }
      }
      
      const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/user-details-enrollmentNo/${enrollmentNo}/`);
        setUserDetails({
          ...response.data,
          originalIsAdmin: response.data.is_admin,
          originalIsReviewer: response.data.is_reviewer,
        });
        console.log("userdetails:-",response.data);
      } catch (err) {
        setError('Error fetching user details.');
        console.error(err.message);
      }
    };
    fetchCurrentUserDetails();
    fetchUserDetails();
  }, [enrollmentNo]);

  // Handle button actions
  const handleDelete = async () => {
    try {
      await axios.get(`http://127.0.0.1:8000/users/delete/${enrollmentNo}/`);
      console.log("Successfully deleted");
      alert("Deleted");
      navigate('/homepage'); // Redirect after deletion
    } catch (err) {
      setError('Error deleting user.');
      console.error(err.message);
    }
  };

  const handleBan = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/${enrollmentNo}/ban/`);
      alert('User has been banned.');
    } catch (err) {
      setError('Error banning user.');
      console.error(err.message);
    }
  };

  // Submit all changes (admin/reviewer toggles)
  const handleSubmit = async () => {
    console.log(userDetails);
    try {
      const updatedUser = {
        ...userDetails,
        is_admin: userDetails.is_admin,
        is_reviewer: userDetails.is_reviewer,
      };

      await axios.post(`http://127.0.0.1:8000/users/change-user-info-admin/${enrollmentNo}/`, updatedUser);
      alert('User details updated successfully.');
    } catch (err) {
      setError('Error updating user details.');
      console.error(err.message);
    }
  };

  // Go Back Button
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userDetails) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <div className="min-h-screen">
      <Navbar /> {/* Include the Navbar component */}

      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6">User Details</h1>

        <div className="bg-white shadow-md rounded p-6">
          {/* Profile picture */}
          {userDetails.profilePicture && (
            <div className="mb-4">
              <img 
                 src={`http://127.0.0.1:8000${userDetails.profilePicture}`}
                alt={`${userDetails.name}'s profile`} 
                className="w-32 h-32 rounded-full object-cover" 
              />
            </div>
          )}

          <p><strong>Enrollment No:</strong> {userDetails.enrollmentNo}</p>
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Reviewer:- </strong> {userDetails.is_reviewer}</p>
          <p><strong>Points:- </strong> {userDetails.points}</p>

          {/* Toggling Admin and Reviewer status */}
          {currentUserDetails?.is_admin && (
  <>
    {/* Admin/Reviewer checkboxes */}
    <div className="mt-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={userDetails.is_admin}
          onChange={() => setUserDetails((prev) => ({ ...prev, is_admin: !prev.is_admin }))}
        />
        <span className="ml-2">Admin</span>
      </label>
      <label className="flex items-center mt-2">
        <input
          type="checkbox"
          checked={userDetails.is_reviewer}
          onChange={() => setUserDetails((prev) => ({ ...prev, is_reviewer: !prev.is_reviewer }))}
        />
        <span className="ml-2">Reviewer</span>
      </label>
    </div>

    {/* Buttons for actions */}
    <div className="mt-6 space-x-4">
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Changes
      </button>

      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
        Delete
      </button>

      <button onClick={handleBan} className="bg-yellow-500 text-white px-4 py-2 rounded">
        Ban User
      </button>

      {/* Go Back Button */}
      <button onClick={handleGoBack} className="bg-gray-500 text-white px-4 py-2 rounded">
        Go Back
      </button>
    </div>
  </>
)}

        </div>
      </div>
    </div>
  );
}

export default UserDetailPage;
