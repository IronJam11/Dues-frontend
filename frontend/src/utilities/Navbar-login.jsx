import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
 // Make sure to import js-cookie
import handleLogout from '../functions/handleLogout';

function NavbarLogin() {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-2xl font-bold">
        <Link to="/" className="hover:text-gray-300">
         DUES
        </Link>
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/registerpage");

          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Register 
        </button>
      </div>
    </nav>
  );
}

export default NavbarLogin;
