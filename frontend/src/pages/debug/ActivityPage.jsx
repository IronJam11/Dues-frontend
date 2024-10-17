import React from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';

const UserActivitystatus = () => {
  const { allUsers } = useWebSocket();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Activity Status</h2>
      
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-2">All Users</h3>
        {allUsers.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-2">
            {allUsers.map((user) => (
              <li key={user.enrollmentNo} className="flex justify-between items-center p-2 border-b border-gray-200">
                <span className="font-medium">{user.name}</span>
                <span className={`text-sm ${user.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
                  {user.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserActivitystatus;
