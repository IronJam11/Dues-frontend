import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth';
import Cookies from 'js-cookie';
import ProjectList from './components/UserProjectList'; // Import the ProjectList component

function UserProjects() {
  const [projects, setProjects] = useState([]);
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = Cookies.get('accessToken');
        const response = await axios.get(`http://127.0.0.1:8000/workspaces/user-workspaces/`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Users workspaces:- ", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleNewProject = () => {
    navigate('/new-project'); 
  };

  const handleDeleteProject = async (roomname) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/workspaces/delete/${roomname}/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`
          }
        });

        if (response.status === 200) {
          setProjects((prevProjects) => prevProjects.filter(project => project.roomname !== roomname));
          alert('Project deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleGroupChat = async (roomname) => {
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.get("http://127.0.0.1:8000/users/user-data/", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const enrollmentNo = response.data.enrollmentNo;
      navigate(`project-chat/${enrollmentNo}/${roomname}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignments = (roomname) => {
    navigate(`/workspaces/assignments/${roomname}`); 
  };

  const handleViewProject = (roomname) => {
    navigate(`project-info/${roomname}`); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-black">Workspaces</h2>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{projects.length === 0 ? 'No workspaces found.' : `${projects.length} workspace(s) found.`}</p>
            <button
              onClick={handleNewProject}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              New Workspace
            </button>
          </div>

          <ProjectList
            projects={projects}
            onView={handleViewProject}
            onDelete={handleDeleteProject}
            onGroupChat={handleGroupChat}
            onAssignments={handleAssignments}
          />
        </div>
      </main>
    </div>
  );
}

export default UserProjects;
