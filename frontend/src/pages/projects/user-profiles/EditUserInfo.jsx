// UserProfileEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const UserProfileEdit = () => {
  const { enrollmentNo , roomname } = useParams(); // Get enrollment number from URL path
  const [userDetails, setUserDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);
  const [isReviewee, setIsReviewee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/user-details-enrollmentNo/${enrollmentNo}/${roomname}/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        });
        console.log("user details",response.data.workspaces)
        
        const data = response.data.workspaces[0];
        setUserDetails(data);
        
        setIsAdmin(data.is_admin);
        setIsReviewer(data.is_reviewer);
        setIsReviewee(data.is_reviewee);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [enrollmentNo]);

  const handleRoleUpdate = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/workspaces/edit-permission/`,
        { isAdmin : isAdmin ? "true" : "false", isReviewer: isReviewer ? "true" : "false", isReviewee: isReviewee ? "true" : "false"  ,roomname, enrollmentNo},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      alert('Roles updated successfully');
    } catch (err) {
      console.error('Failed to update roles:', err);
      alert('Failed to update roles');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-600">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Edit User Roles</h1>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">{userDetails.name}</p>
          <p className="text-gray-500">{userDetails.alias}</p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
              className="mr-2"
            />
            <span className="text-gray-700">Admin</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isReviewer}
              onChange={() => setIsReviewer(!isReviewer)}
              className="mr-2"
            />
            <span className="text-gray-700">Reviewer</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isReviewee}
              onChange={() => setIsReviewee(!isReviewee)}
              className="mr-2"
            />
            <span className="text-gray-700">Reviewee</span>
          </label>
        </div>

        <button
          onClick={handleRoleUpdate}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfileEdit;
