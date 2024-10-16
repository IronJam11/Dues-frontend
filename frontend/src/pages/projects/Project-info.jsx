import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main';  // Adjust path if needed
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom'; // Import useParams

const ProjectDetail = () => {
  const { roomname } = useParams();  // Extract roomname from the URL params
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch project details by roomname
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/projects/project-details/${roomname}/`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`
          }
        });
        console.log(response.data);
        setProject(response.data.project);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch project details');
        setLoading(false);
      }
    };

    fetchProject();
  }, [roomname]);

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
        <p className="mb-4">{project.description}</p>

        <div className="mb-8">
          <img
             src={`http://127.0.0.1:8000${project.group_image}`}
            alt="Group"
            className="w-48 h-48 object-cover rounded-lg shadow-md mb-4"
          />
          <p><strong>Time Assigned:</strong> {new Date(project.time_assigned).toLocaleString()}</p>
          <p><strong>Deadline:</strong> {new Date(project.deadline).toLocaleString()}</p>
          <p><strong>Room Name:</strong> {project.roomname}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Participants</h2>
        <ul className="space-y-4">
          {project.participants.map((participant) => (
            <li key={participant.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p><strong>Name:</strong> {participant.name}</p>
              <p><strong>Alias:</strong> {participant.alias}</p>
              <p><strong>Email:</strong> {participant.email}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Assignments</h2>
        <ul className="space-y-4">
          {project.assignments.map((assignment) => (
            <li key={assignment.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p><strong>Name:</strong> {assignment.name}</p>
              <p><strong>Description:</strong> {assignment.description}</p>
              <p><strong>Total Points:</strong> {assignment.total_points}</p>
              <p><strong>Deadline:</strong> {new Date(assignment.deadline).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetail;
