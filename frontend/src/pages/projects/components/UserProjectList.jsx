import React from 'react';

const ProjectList = ({ projects, onView, onDelete, onGroupChat, onAssignments }) => {
  if (projects.length === 0) {
    return <p className="text-center text-gray-600">No projects available.</p>;
  }

  return (
    <ul className="space-y-6">
      {projects.map((project) => (
        <li 
          key={project.roomname} 
          className="p-6 border border-gray-300 rounded-lg shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 bg-white animate-fade-in"
        >
          {/* Project Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(project.deadline).toLocaleString()}</p>
          <p className="text-sm text-gray-500 mb-4">Room Name: {project.roomname}</p>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4 space-x-4">
            {/* View button */}
            <button
              onClick={() => onView(project.roomname)}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
            >
              View
            </button>
            
            {/* Conditionally Render Delete button if isAdmin is true */}
            {project.isAdmin && (
              <button
                onClick={() => onDelete(project.roomname)}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
              >
                Delete
              </button>
            )}

            {/* Group Chat button */}
            <button
              onClick={() => onGroupChat(project.roomname)}
              className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300 transform hover:scale-105"
            >
              Group Chat
            </button>

            {/* Assignments button */}
            <button
              onClick={() => onAssignments(project.roomname)}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
            >
              Assignments
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
