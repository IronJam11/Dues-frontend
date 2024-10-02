import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importing js-cookie
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(base64);
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
}
function storeToken(token) {
  const decodedToken = parseJwt(token);
  
  if (decodedToken) {
    const expirationTime = decodedToken.exp * 1000; // JWT exp is usually in seconds, convert to ms
    sessionStorage.setItem('jwtToken', token);
    sessionStorage.setItem('tokenExpiration', expirationTime);
    localStorage.setItem('enrollmentNo',sessionStorage.getItem('jwtToken'));
    localStorage.setItem('enrollmentNo',sessionStorage.getItem('enrollmentNo'));
    console.log(sessionStorage.getItem('tokenExpiration'))
  }
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/users/logout/", {}, {
        withCredentials: true, // Ensure cookies are included in the request
      });
      console.log("before deleting :", Cookies.get('jwt'));
      Cookies.remove('jwt');
      console.log("after deleting :", Cookies.get('jwt'));// Remove enrollment number cookie
  
      navigate('/loginpage');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login/', {
        email,
        password,
      }, {
        withCredentials: true, // Send credentials with the request
      });
      console.log(response.data);
      storeToken(response.data.jwt)
      Cookies.set('jwt',response.data.jwt,{expires : 1});
      console.log('cookies set to: ',Cookies.get('jwt'));
      sessionStorage.setItem('enrollmentNo',response.data.enrollmentNo)
      navigate("/homepage");

      
      // Rest of the code for storing the token...
    } catch (error) {
      alert("Invalid credentials!!!")
      console.error('Error during login:', error);
    }
  };
  
  

  const handleChanneliAuth = () => {
    window.location.href = 'http://127.0.0.1:8000/users/auth/oauth/';
  };

  const handleRegister = () => {
    navigate('/registerpage'); // Replace with the actual route for your registration page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center container mx-auto">
          <h1 className="text-xl font-bold">DUEs</h1>
          <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>

          {/* Channeli OAuth2.0 button */}
          <button
            className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={handleChanneliAuth}
          >
            Login with Channeli
          </button>

          {/* Register button */}
          <button
            className="w-full px-4 py-2 mt-4 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
