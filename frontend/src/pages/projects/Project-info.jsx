import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
  const { roomname } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleRemove(enrollmentNo) {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/workspaces/delete-user/`,
        { roomname, enrollmentNo },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      console.log("response for removal", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/workspaces/workspace-details/${roomname}/`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        });
        console.log('PROJECT DETAILS', response.data);
        setWorkspace(response.data.workspace);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch project details');
        setLoading(false);
      }
    };

    fetchProject();
  }, [roomname]);

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-600">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 relative">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">{workspace.name}</h1>
        <p className="text-lg text-gray-600 mb-4">{workspace.description}</p>

        {workspace.isAdmin && (
        <div className="absolute top-8 right-8 flex gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
            onClick={() => navigate(`/workspaces/${roomname}/ideas`)}
          >
            Ideas 
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
            onClick={() => navigate(`add-users`)}
          >
            Add Users
          </button>
        </div>
      )}

        <div className="mb-8 flex flex-col md:flex-row items-start gap-8">
          <img
            src={`http://127.0.0.1:8000${workspace.group_image}`}
            alt="Group"
            className="w-full md:w-48 h-48 object-cover rounded-lg shadow-md"
          />
          <div className="text-gray-700">
            <p className="text-lg"><strong>Time Assigned:</strong> {new Date(workspace.time_created).toLocaleString()}</p>
            <p className="text-lg"><strong>Deadline:</strong> {new Date(workspace.deadline).toLocaleString()}</p>
            <p className="text-lg"><strong>Room Name:</strong> {workspace.roomname}</p>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Participants</h2>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspace.participants.map((participant) => (
            <li key={participant.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={`http://127.0.0.1:8000${participant.profilePicture}`}
                alt={`${participant.name}'s profile`}
                className="w-24 h-24 object-cover rounded-full mb-4"
              />
              <p className="text-lg font-bold text-gray-700">{participant.name}</p>
              <p className="text-sm text-gray-500">{participant.alias}</p>
              <p className="text-sm text-gray-500">{participant.email}</p>

              {/* Show edit and delete buttons if the user is an admin */}
              {workspace.isAdmin && (
                <div className="mt-4 flex gap-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                    onClick={() => {
                      navigate(`${participant.enrollmentNo}`);
                    }}
                  >
                    Edit Details
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                    onClick={() => handleRemove(participant.enrollmentNo)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <h2 className="text-3xl font-semibold text-gray-800 mt-10 mb-4">Assignments</h2>
        <ul className="space-y-6">
          {workspace.assignments.map((assignment) => (
            <li key={assignment.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">{assignment.name}</h3>
              <p className="text-gray-600">{assignment.description}</p>
              <div className="flex justify-between mt-4 text-gray-500">
                <p><strong>Total Points:</strong> {assignment.total_points}</p>
                <p><strong>Deadline:</strong> {new Date(assignment.deadline).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetail;
