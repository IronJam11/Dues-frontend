import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; // Assuming you have a Navbar component
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const IdeaSubmissionForm = () => {
  const { roomname } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urls, setUrls] = useState(['']); // Array to handle dynamic URLs
  const [selectedUsers, setSelectedUsers] = useState([]); // Array to store selected users
  const [users, setUsers] = useState([]); // Array to store fetched users
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch available users on component load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/workspaces/workspace-details/${roomname}/`,
            {
                withCredentials: true,
                headers: 
                {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`
                }
            }
        );
        console.log("Data:-",response.data)
        setUsers(response.data.workspace.participants); // Assuming API returns an array of user objects
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // Reset success message on submit
    setError(null); // Reset error on submit

    try {
        console.log({
            title,
            description,
            links: urls.filter((url) => url !== ''), // Filter out empty URL fields
            users: selectedUsers, // Send selected user IDs
          });
      const response = await axios.post(
        `http://127.0.0.1:8000/ideas/create-workspace-idea/${roomname}/`,
        {
          title,
          description,
          links: urls.filter((url) => url !== ''), // Filter out empty URL fields
          users: selectedUsers, // Send selected user IDs
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );

      // Handle successful submission
      if (response.status === 201) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setUrls(['']); // Reset the URL fields
        setSelectedUsers([]); // Reset selected users
      }
    } catch (err) {
      setError('Failed to submit idea. Please try again.');
    }
  };

  // Handle adding a new URL field
  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  // Handle removing a URL field
  const handleRemoveUrl = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  // Handle URL input change
  const handleUrlChange = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };

  // Handle user checkbox toggle
  const handleUserToggle = (userEmail) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userEmail)) {
        // If user is already selected, remove them
        return prevSelectedUsers.filter((email) => email !== userEmail);
      } else {
        // If user is not selected, add them
        return [...prevSelectedUsers, userEmail];
      }
    });
  };

  return (
    <div>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Propose a New Idea</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Idea submitted successfully!</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-lg font-semibold mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
              placeholder="Enter idea title"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-lg font-semibold mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
              placeholder="Enter idea description"
            ></textarea>
          </div>

          {/* User Selection with Checkboxes */}
          <div>
            <label className="block text-lg font-semibold mb-2">Select Contributors</label>
            <div className="flex flex-wrap">
              {users.map((user) => (
                <div key={user.email} className="mr-4 mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => handleUserToggle(user.email)}
                    />
                    <span>{user.name} ({user.email})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* URL Fields */}
          <div>
            <label className="block text-lg font-semibold mb-2">Related Links (optional)</label>
            {urls.map((url, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 p-2 rounded-md"
                  placeholder="Enter URL"
                />
                {/* Add button to remove a URL field */}
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    className="ml-4 text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Button to add more URL fields */}
            <button
              type="button"
              onClick={handleAddUrl}
              className="text-blue-500 underline"
            >
              + Add another link
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Idea
          </button>
        </form>
      </div>
    </div>
  );
};

export default IdeaSubmissionForm;
