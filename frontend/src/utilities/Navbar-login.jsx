import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavbarLogin() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      {/* Animated Logo */}
      <motion.div 
        className="text-white text-2xl font-bold"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link to="/" className="hover:text-indigo-400 text-4xl transition duration-300">
          DUES
        </Link>
      </motion.div>

      {/* Register Button with Hover Effect */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/registerpage")}
        className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-600 transition duration-300"
      >
        Register
      </motion.button>
    </nav>
  );
}

export default NavbarLogin;
