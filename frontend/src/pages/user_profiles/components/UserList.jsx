import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard'; // Import the new UserCard component

const UserList = ({ users }) => {
  const navigate = useNavigate();

  const handleChatClick = (userEnrollmentNo) => {
    if (userEnrollmentNo) {
      navigate(`/user-profiles/${userEnrollmentNo}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl mt-6">
      {users.map((user) => (
        <UserCard key={user.enrollmentNo} user={user} onChatClick={handleChatClick} />
      ))}
    </div>
  );
};

export default UserList;
