import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users }) => {
  const navigate = useNavigate();

  const handleChatClick = (userEnrollmentNo) => {
    if (userEnrollmentNo) {
      navigate(`/user-profiles/${userEnrollmentNo}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl mt-6 animate-fade-in-once">
      {users.map((user) => (
        <div
          key={user.enrollmentNo}
          className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition duration-300"
        >
          <div
            className={`relative inline-block ${
              user.status === 'Online' ? 'border-4 border-green-500' : ''
            } rounded-full p-1 animate-pulse-once`}
          >
            <img
              src={`http://127.0.0.1:8000${user.profilePicture}`}
              alt={`${user.name}'s profile`}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover animate-zoom-in-once"
            />
            {user.status === 'Online' && (
              <span className="absolute top-0 right-0 block h-6 w-6 bg-green-500 border-2 border-white rounded-full animate-ping-once"></span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-black mb-2 animate-slide-in-once">
            {user.name}
          </h2>
          <p className="text-black mb-4">@{user.alias}</p>
          <p className="text-black mb-6">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
          <p className="text-black mb-6">{user.status}</p>
          <button
            onClick={() => handleChatClick(user.enrollmentNo)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300 animate-bounce-once"
          >
            Chat
          </button>
          <button
            onClick={() => handleChatClick(user.enrollmentNo)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300 animate-bounce-once"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;