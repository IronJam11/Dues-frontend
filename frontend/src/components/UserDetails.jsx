import React from 'react';

function UserDetails({ user,  onEditClick }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 pt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-11/12 md:w-3/4 lg:w-1/2">
        <ProfileSection user={user} />
        <TagsSection tags={user.tags} />
        <WorkspacesSection workspaces={user.workspaces} />
        <NotificationsSection notifications={user.notifications} />
        <div className="flex justify-center mt-6">
          <button
            onClick={onEditClick}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user }) {
  return (
    <div className="mb-6">
      <img
        src={ `http://127.0.0.1:8000${user.profilePicture}` || 'https://via.placeholder.com/150'}
        alt={`${user.name}'s profile`}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500"
      />
      <h2 className="text-2xl font-bold text-black">{user.name}</h2>
      <p className="text-gray-700">@{user.alias}</p>
      <p className="text-gray-700">{user.isDeveloper ? 'Developer' : 'Designer'}</p>
      <p className="text-gray-700">Streak: {user.streak || 1}</p>
      <p className="text-gray-700">Points: {user.points || 0}</p>
    </div>
  );
}

function TagsSection({ tags }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Tags</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: tag.color }}
          >
            <span>{tag.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspacesSection({ workspaces }) {
  return (
    <div className="w-full mb-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Workspaces</h3>
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md text-center flex flex-col items-center"
            >
              <img
                src={ `http://127.0.0.1:8000${workspace.group_image}` || 'https://via.placeholder.com/100'}
                alt={workspace.name}
                className="w-24 h-24 rounded-full mb-4"
              />
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

// Notification Section
function NotificationsSection({ notifications }) {
  return (
    <div className="w-full mb-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">Notifications</h3>
      {notifications.length > 0 ? (
        <div className="space-y-4">
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
