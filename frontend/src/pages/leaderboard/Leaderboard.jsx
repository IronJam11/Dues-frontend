import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; // Import the Navbar component
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'; // Import Link
import { motion } from 'framer-motion'; // Import motion from framer-motion

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPoints, setMaxPoints] = useState(0); // To store the maximum points

  useEffect(() => {
    // Fetch user data from the API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/all-users-details/', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        });
        // Sort users by points in descending order
        const sortedUsers = response.data.users.sort((a, b) => b.points - a.points);
        setUsers(sortedUsers);
        setMaxPoints(sortedUsers[0].points); // Get the maximum points (first user after sorting)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10">Leaderboard</h1>

        <div className="max-w-4xl mx-auto">
          {/* Iterate over users and display their profiles */}
          {users.map((user) => {
            // Calculate the relative width based on the user's points
            const barWidth = (user.points / maxPoints) * 100;

            return (
              <motion.div
                key={user.enrollmentNo}
                className="flex flex-col bg-white shadow-md rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 20 }} // Initial state for animation
                animate={{ opacity: 1, y: 0 }}   // Animation when the component mounts
                transition={{ duration: 0.5 }}    // Transition properties
              >
                <div className="flex items-center space-x-4">
                  {/* User's profile picture */}
                  <Link to={`/user-profiles/${user.enrollmentNo}`}>
                    <img
                      src={`http://127.0.0.1:8000${user.profilePicture}`}
                      alt={`${user.name}'s profile`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    {/* User's name and alias wrapped in Link */}
                    <h2 className="text-xl font-bold text-gray-900">
                      <Link to={`/user-profiles/${user.enrollmentNo}`}>{user.name}</Link> {/* Navigate to user profile */}
                    </h2>
                    <p className="text-gray-600">@{user.alias}</p>
                  </div>
                </div>

                {/* Bar representing the user's points with animations */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="bg-blue-500 h-full rounded-full"
                    initial={{ width: 0 }} // Start with width 0
                    animate={{ width: `${barWidth}%` }} // Animate to the calculated width
                    transition={{ duration: 0.7, ease: "easeInOut" }} // Animation properties
                  ></motion.div>
                </div>

                {/* Display the user's points */}
                <div className="mt-2 text-lg font-semibold text-blue-700">
                  Points: {user.points}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
