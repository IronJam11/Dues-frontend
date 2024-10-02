import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';

function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    year: '',
    name: '',
    profileImage: null,
    existingProfileImage: '', // State to store the existing profile image URL
    isDeveloper: false,
    alias: '',
  });

  // Fetch user data from the API when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/user-info/`, {
          withCredentials: true,
        }); // Adjust URL as necessary
        setFormData({
          year: response.data.year || '',
          name: response.data.name || '',
          profileImage: null, // Reset for new uploads
          existingProfileImage: response.data.profilePhoto || '', // Store existing image URL
          isDeveloper: response.data.isDeveloper || false,
          alias: response.data.alias || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('year', formData.year);
    data.append('name', formData.name);
    if (formData.profileImage) data.append('profilePicture', formData.profileImage); // Only append if a new image is uploaded
    data.append('isDeveloper', formData.isDeveloper);
    data.append('alias', formData.alias);

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/change-user-info/', data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      navigate("/homepage");
      // Optionally navigate or show a success message
    } catch (error) {
      console.error('Error submitting form:', error.response.data);
    }
  };

  return (
    <>
      <Navbar /> {/* Use your existing Navbar */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 pt-10">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-900">Edit User Details</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          {/* Display existing profile image */}
          {formData.existingProfileImage && (
            <div className="mb-4 text-center">
              <img
                src={`http://127.0.0.1:8000/media/${formData.existingProfileImage}`} // Adjust URL as necessary
                alt="Current Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Current Profile Image</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-black">
              <input
                type="checkbox"
                name="isDeveloper"
                checked={formData.isDeveloper}
                onChange={handleChange}
                className="mr-2"
              />
              Developer
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Alias</label>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
          >
            Edit Details
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfilePage;
