import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCardAdmin = ({ users, onViewProfile, onChat, onSuspend }) => {
  const navigate = useNavigate();

  const handleViewProfileClick = (userEnrollmentNo) => {
    onViewProfile(userEnrollmentNo); // Call the provided handler for profile view
  };

  const handleChatClick = (userEnrollmentNo) => {
    onChat(userEnrollmentNo); // Call the provided handler for chat
  };

  const handleSuspendClick = (userEnrollmentNo) => {
    onSuspend(userEnrollmentNo); // Call the provided handler for suspending the user
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl mx-auto mt-6">
      {users.map((user) => (
        <div
          key={user.enrollmentNo}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center"
        >
          <div
            className={`relative inline-block ${
              user.status === 'Online' ? 'border-4 border-green-500' : ''
            } rounded-full p-1`}
          >
            <img
              src={`http://127.0.0.1:8000${user.profilePicture}`}
              alt={`${user.name}'s profile`}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            {user.status === 'Online' && (
              <span className="absolute top-0 right-0 block h-6 w-6 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <h2 className="text-xl font-bold text-black mb-2">
            {user.name}
          </h2>
          <p className="text-gray-600 mb-2">@{user.alias}</p>
          <p className="text-sm text-gray-500 mb-6">{user.status}</p>

          <div className="flex flex-col space-y-2">
            {/* View Profile button */}
            <button
              onClick={() => handleViewProfileClick(user.enrollmentNo)}
              className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              View Profile
            </button>
            {/* Chat button */}
            <button
              onClick={() => handleChatClick(user.enrollmentNo)}
              className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
            >
              Chat
            </button>
            {/* Suspend button */}
            <button
              onClick={() => handleSuspendClick(user.enrollmentNo)}
              className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
            >
              Suspend
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCardAdmin;
