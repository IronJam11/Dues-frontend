import React, { useState, useEffect } from 'react';

function CookiesPage() {
  const [cookies, setCookies] = useState([]);
  const token = sessionStorage.getItem('jwtToken')

  useEffect(() => {
    // Get all cookies from document.cookie
    const allCookies = document.cookie.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return { name, value };
    });
    setCookies(allCookies);
  }, []);

  return (
    <div className="min-h-screen text-blck bg-gray-100 p-8">
      <h1 className="text-3xl text-black font-bold">{token}</h1>
      <div className="mt-4">
        {cookies.length > 0 ? (
          <ul>
            {cookies.map((cookie, index) => (
              <li key={index} className="py-2 text-black">
                <strong>{cookie.name}:</strong> {decodeURIComponent(cookie.value)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cookies found!</p>
        )}
      </div>
    </div>
  );
}

export default CookiesPage;
