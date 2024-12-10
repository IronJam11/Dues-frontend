import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../utilities/Navbar-login';
import handleLogin from '../../functions/handleLogin';
import handleLoginWithChannelI from '../../functions/handleLoginWithChanneli';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayText, setDisplayText] = useState('');
  const navigate = useNavigate();

  // Typing animation effect
  useEffect(() => {
    const phrases = [
      'Manage assignments',
      'Achieve weekly goals',
      'Collaborate with your group',
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
          setTimeout(() => {}, 1500);
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

    const interval = setInterval(typeEffect, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg animate-fadeIn">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 animate-pulse">{displayText}</h1>
        
        <form onSubmit={(e) => handleLogin(e, email, password, navigate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Divider with text */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Login with ChannelI button */}
        <button
          onClick={() => {
            const authUrl = "http://localhost:8000/users/auth/oauth";
            window.location.href = authUrl;
          }}
          className="w-full py-3 text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg shadow-md hover:bg-indigo-600 hover:text-white transition-transform transform hover:scale-105"
        >
          Login with ChannelI
        </button>

        {/* Footer with subtle animation */}
        <div className="mt-6 text-sm text-gray-400 text-center animate-fadeIn">
          By logging in, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
