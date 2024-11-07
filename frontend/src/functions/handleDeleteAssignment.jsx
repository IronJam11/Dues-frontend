import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DeleteAssignment = ({ unique_name, onDelete }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDeleteAssignment = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('accessToken');
      const deleteResponse = await axios.delete(`http://127.0.0.1:8000/assignments/delete/${unique_name}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(deleteResponse.data);
      alert('Assignment was successfully deleted!');
      onDelete(unique_name); // Call the callback to update state in parent component
    } catch (error) {
      console.error('Error deleting assignment:', error.message);
      alert('Failed to delete the assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeleteAssignment}
      className={`relative bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold py-1.5 px-3 rounded transition-transform transform duration-200 h-10 min-w-[100px] ${loading ? 'scale-95 opacity-50' : ''}`} // Adjusted size and padding
      disabled={loading}
    >
      {loading ? <span className="spinner" /> : 'Delete'}

      {/* Custom Spinner CSS */}
      <style jsx>{`
        .spinner {
          border: 2px solid #f3f3f3;
          border-radius: 50%;
          border-top: 2px solid #3498db;
          width: 14px;
          height: 14px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-left: 8px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
};

export default DeleteAssignment;
