import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Navbar from '../../utilities/Navbar-main'; // Adjust the import path if necessary
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';

function UserProjects() {
  const [projects, setProjects] = useState([]);
  const isAuthenticated = useAuth();
  
  const navigate = useNavigate(); // Initialize navigate hook
 

  useEffect(() => {
    // Fetch the user's projects
    const fetchProjects = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`http://127.0.0.1:8000/projects/user-projects/`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Handle redirect to create new project page
  const handleNewProject = () => {
    navigate('/new-project'); // Update this path to the correct route for creating a new project
  };

  // Handle delete project
  const handleDeleteProject = async (roomname) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/projects/delete/${roomname}/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`
          }
        });

        if (response.status === 200) {
          // Remove the deleted project from the list
          setProjects((prevProjects) => prevProjects.filter(project => project.roomname !== roomname));
          alert('Project deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  // Handle navigation to group chat
  const handleGroupChat = async (roomname) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get("http://127.0.0.1:8000/users/user-data/", 
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const enrollmentNo = response.data.enrollmentNo;
      navigate(`project-chat/${enrollmentNo}/${roomname}`);

    } catch (error) {
      console.error(error);
    }
  };

  // Handle navigation to assignments
  const handleAssignments = (roomname) => {
    navigate(`assignments/${roomname}`); // Navigate to assignments page with the roomname
  };

  // Handle navigation to project details
  const handleViewProject = (roomname) => {
    navigate(`project-info/${roomname}`); // Navigate to the project details page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar at the top */}
      <header>
        <Navbar />
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">My Projects </h2>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{projects.length === 0 ? 'No projects found.' : `${projects.length} project(s) found.`}</p>
            {/* New Project button */}
            <button
              onClick={handleNewProject}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <p className="text-center text-gray-600">No projects available.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.roomname} className="p-4 border border-gray-300 rounded-lg">
                  <h3 className="text-lg font-bold text-black">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <p className="text-sm text-gray-600">Deadline: {new Date(project.deadline).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Room Name: {project.roomname}</p>
                  <div className="flex justify-between items-center mt-4">
                    {/* View button */}
                    <button
                      onClick={() => handleViewProject(project.roomname)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                    >
                      View
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteProject(project.roomname)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                    >
                      Delete Project
                    </button>
                    {/* Group Chat button */}
                    <button
                      onClick={() => handleGroupChat(project.roomname)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                    >
                      Group Chat
                    </button>
                    {/* Assignments button */}
                    <button
                      onClick={() => handleAssignments(project.roomname)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
                    >
                      Assignments
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserProjects;
