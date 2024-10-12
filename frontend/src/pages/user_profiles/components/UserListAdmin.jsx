// src/components/UserList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserListAdmin= ({ users}) => {
  const navigate = useNavigate();

  const handleChatClick = (userEnrollmentNo) => {
    if (enrollmentNo) {
      navigate(`/${userEnrollmentNo}`);
    }
  };
  const handleEditClick = (enrollmentNo) =>
  {
   navigate(`${enrollmentNo}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl mt-6">
      {users.map((user) => (
        <div key={user.enrollmentNo} className="bg-white p-6 rounded-lg shadow-lg text-center">
          <img
            src={`http://127.0.0.1:8000${user.profilePicture}`}
            alt={`${user.name}'s profile`}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-black mb-2">{user.name}</h2>
          <p className="text-black mb-4">@{user.alias}</p>
          <p className="text-black mb-6">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
          <button
            onClick={() => handleChatClick(user.enrollmentNo)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
          >
            Chat
          </button>

          <button
            onClick={() => handleEditClick(user.enrollmentNo)}
            className="px-4 py-2 bg-red-300 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserListAdmin;
