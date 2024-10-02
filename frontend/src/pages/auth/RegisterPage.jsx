import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/logout/', {
        enrollmentNumber,
        email,
        password,
      });
      console.log('Logout Successful:', response.data);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/register/', {
        "enrollmentNo":enrollmentNumber,
        "email":email,
        "password":password,
      });
      console.log('Registration Successful:', response.data);
      navigate(`/loginpage/${enrollmentNumber}/`)
      // Handle success (e.g., redirect to login page, show success message)
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enrollment Number</label>
            <input 
              type="text" 
              value={enrollmentNumber} 
              onChange={(e) => setEnrollmentNumber(e.target.value)} 
              required 
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Register
          </button>
        </form>
        <button onClick={handleLogout} className="w-full px-4 py-2 mt-4 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Logout
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
