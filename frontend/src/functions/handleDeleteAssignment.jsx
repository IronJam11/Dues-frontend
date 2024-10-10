// src/utilities/DeleteAssignment.js
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DeleteAssignment = ({ unique_name, onDelete }) => {
  const handleDeleteAssignment = async () => {
    try {
      const token = Cookies.get('accessToken');
      const deleteResponse = await axios.delete(`http://127.0.0.1:8000/assignments/delete/${unique_name}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(deleteResponse.data);
      alert("Assignment was successfully deleted!");
      onDelete(unique_name); // Call the callback to update state in parent component
    } catch (error) {
      console.error('Error deleting assignment:', error.message);
      alert("Failed to delete the assignment.");
    }
  };

  return (
    <button
      onClick={handleDeleteAssignment}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded mb-2"
    >
      Delete
    </button>
  );
};

export default DeleteAssignment;
