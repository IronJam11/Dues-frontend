import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../pages/hooks/useAuth';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
//   if(!isAuthenticated)
//   {
//     alert("You are not logged in !!")
//   }

  if (isLoading) return <div>Loading...</div>;  // Show loading message while checking

  return isAuthenticated ? element : <Navigate to="/loginpage" />;
};

export default ProtectedRoute;
