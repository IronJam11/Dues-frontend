import React from 'react';

const UserCard = ({ user, onChatClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
      {/* Rectangular profile image stretching fully across the top */}
      <div className="relative w-full h-40 overflow-hidden rounded-lg mb-4">
        <img
          src={`http://127.0.0.1:8000${user.profilePicture}`}
          alt={`${user.name}'s profile`}
          className="w-full h-full object-cover"
        />
        {user.status === 'Online' && (
          <span className="absolute top-2 right-2 block h-4 w-4 bg-green-500 border-2 border-white rounded-full animate-ping"></span>
        )}
      </div>

      {/* User information */}
      <h2 className="text-xl font-bold text-black mb-2">{user.name}</h2>
      <p className="text-gray-600 mb-1">@{user.alias}</p>
      <p className="text-gray-700 mb-2">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
      <p className={`text-sm mb-4 ${user.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
        {user.status}
      </p>

      {/* Tags Section */}
      <div className="flex flex-wrap justify-center mb-4">
        {user.tags && user.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block px-3 py-1 bg-gray-200 text-sm font-medium text-gray-700 rounded-full m-1"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => onChatClick(user.enrollmentNo)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
        >
          Chat
        </button>
        <button
          onClick={() => onChatClick(user.enrollmentNo)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default UserCard;
