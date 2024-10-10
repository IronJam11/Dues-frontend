import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
import Navbar from '../../utilities/Navbar-main';
function UserDetailsPage() {
  const { enrollmentNo } = useParams();
  const [name, setName] = useState('');
  const [year, setYear] = useState('1');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('developer');
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  console.log(enrollmentNo);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]); // Get the selected file
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let isDeveloper = false;
    if(role == "Developer") isDeveloper = true;
    const data = {
        "enrollmentNo":enrollmentNo,
        "name":name,
        "year":year,
        "alias":alias,
        "isDeveloper":role,
        "profilePicture":profilePic,
        "password": "",
        
    }
    console.log(data);

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/set-user-details/', data, {
        headers: {
          Authorization: `bearer ${Cookies.get('accessToken')}`
        },
      });

      console.log('User Registered Successfully:', response.data);
      navigate('/homepage'); // Redirect to homepage after registration
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Clear the token if required
    navigate('/loginpage2'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Registration Form */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
          <form onSubmit={handleLogin} className="space-y-4" encType="multipart/form-data">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Year of Study</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>

            {/* Alias */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Alias</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
              </select>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
