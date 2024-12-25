import React from 'react';

function UserDetails({ user, onEditClick }) {
  return (
    <div className="min-h-screen bg-white flex justify-center pt-10">
      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row">
        {/* Profile Section */}
        <div className="w-full lg:w-1/3 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <ProfileSection user={user} onEditClick={onEditClick} />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="w-full lg:w-1/2 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg h-full overflow-y-auto">
            <NotificationsSection notifications={user.notifications} />
          </div>
        </div>

        {/* Workspaces Section */}
        <div className="w-full lg:w-1/3 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <WorkspacesSection workspaces={user.workspaces} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user, onEditClick }) {
  return (
    <div className="mb-6 text-center">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">User Profile</h3>
      <img
        src={ `http://127.0.0.1:8000${user.profilePicture}` || 'https://via.placeholder.com/150'}
        alt={`${user.name}'s profile`}
        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
      />
      <h2 className="text-2xl font-bold text-black">{user.name}</h2>
      <p className="text-gray-700">@{user.alias}</p>
      <p className="text-gray-700">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
      <p className="text-gray-700">Streak: {user.streak || 1}</p>
      <p className="text-gray-700">Points: {user.points || 0}</p>
      <br />
      <button
        onClick={onEditClick}
        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
      >
        Edit Profile
      </button>
    </div>
  );
}

function WorkspacesSection({ workspaces }) {
  return (
    <div className="w-full mb-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Workspaces</h3>
      {workspaces.length > 0 ? (
        <div className="space-y-6">
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={ `http://127.0.0.1:8000${workspace.group_image}` || 'https://via.placeholder.com/100'}
                  alt={workspace.name}
                  className="w-24 h-24 rounded-full"
                />
              </div>
              <h4 className="text-lg font-bold text-black mb-2">{workspace.name}</h4>
              <p className="text-gray-700 mb-4">{workspace.description}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {workspace.is_admin && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    Admin
                  </span>
                )}
                {workspace.is_reviewer && (
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                    Reviewer
                  </span>
                )}
                {workspace.is_reviewee && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                    Reviewee
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No workspaces available</p>
      )}
    </div>
  );
}

function NotificationsSection({ notifications }) {
  return (
    <div className="w-full mb-6 h-[400px]">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Notifications</h3>
      {notifications.length > 0 ? (
        <div className="space-y-4 max-h-full overflow-y-auto">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-md text-left"
            >
              <h4 className="text-lg font-bold text-black">{notification.sender}</h4>
              <p className="text-gray-700">{notification.message}</p>
              <p className="text-gray-600 text-sm">{new Date(notification.time).toLocaleString()}</p>
              <span className={`text-sm font-semibold text-${notification.type === 'info' ? 'blue' : 'green'}-600`}>
                {notification.type}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No notifications available</p>
      )}
    </div>
  );
}

export default UserDetails;
