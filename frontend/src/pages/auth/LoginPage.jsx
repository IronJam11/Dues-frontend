import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../utilities/Navbar';
import handleLogin from '../../functions/handleLogin';
import handleLoginWithChannelI from '../../functions/handleLoginWithChanneli';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayText, setDisplayText] = useState('');
  const navigate = useNavigate();
  // const isAuthenticated = useAuth(); // Call useAuth to check authentication

  // Typing animation effect
  useEffect(() => {
    const phrases = [
      'Manage assignments',
      'Hit weekly goals',
      'Chat with your group people',
    ];

    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (!isDeleting) {
        if (currentCharIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, currentCharIndex + 1));
          currentCharIndex++;
        } else {
          isDeleting = true;
          setTimeout(() => {}, 1500); // Pause before deleting
        }
      } else {
        if (currentCharIndex > 0) {
          setDisplayText(currentPhrase.slice(0, currentCharIndex - 1));
          currentCharIndex--;
        } else {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        }
      }
    };

    const interval = setInterval(typeEffect, 80);

    return () => clearInterval(interval);
  }, []);

  // Redirect if authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/homepage");
  //   }
  // }, [isAuthenticated, navigate]); // Dependency array includes isAuthenticated

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">{displayText}</h1>
          <form onSubmit={(e) => handleLogin(e, email, password, navigate)} className="space-y-4">
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

          {/* Button for "Login with channelI" */}
          <button
            onClick={()=> {
              console.log("hello");
              const authUrl = "http://localhost:8000/users/auth/oauth"
              window.location.href = authUrl;
            }}
            className="w-full px-4 py-2 mt-4 text-blue-600 bg-white border-2 border-blue-600 rounded-md hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login with channelI
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
