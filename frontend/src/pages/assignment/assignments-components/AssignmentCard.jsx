import React, { useState } from 'react';
import DeleteAssignment from '../../../functions/handleDeleteAssignment';

const AssignmentCard = ({
  assignment,
  formatDate,
  handleEditAssignment,
  handleAddSubtasks,
  handleViewAssignment,
  handleSubmitAssignment,
  handleDeleteAssignment,
  handleViewAssignmentReviewer
}) => {
  const [loading, setLoading] = useState({
    edit: false,
    addSubtasks: false,
    view: false,
    submit: false,
    delete: false,
    reviewer: false,
  });

  const handleButtonClick = async (action, type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      await action();
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl text-black transition-transform transform hover:scale-105 hover:shadow-2xl">
      <h3 className="text-2xl font-semibold mb-2">{assignment.name}</h3>
      <p className="text-gray-700 mb-4">{assignment.description}</p>
      <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

      <div className="flex flex-wrap gap-2"> {/* Adjusted gap between buttons */}
        {handleEditAssignment && (
          <button
            onClick={() => handleButtonClick(() => handleEditAssignment(assignment.unique_name), 'edit')}
            className={`relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-1.5 px-3 rounded transition-transform transform duration-200 h-10 min-w-[100px] ${loading.edit ? 'scale-95 opacity-50' : ''}`} // Decreased size and padding
            disabled={loading.edit}
          >
            {loading.edit ? <span className="spinner" /> : 'Edit'}
          </button>
        )}
        {handleAddSubtasks && (
          <button
            onClick={() => handleButtonClick(() => handleAddSubtasks(assignment.unique_name), 'addSubtasks')}
            className={`relative bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-1.5 px-3 rounded transition-transform transform duration-200 h-10 min-w-[100px] ${loading.addSubtasks ? 'scale-95 opacity-50' : ''}`} // Decreased size and padding
            disabled={loading.addSubtasks}
          >
            {loading.addSubtasks ? <span className="spinner" /> : 'Add Subtasks'}
          </button>
        )}
        {handleViewAssignment && (
          <button
            onClick={() => handleButtonClick(() => handleViewAssignment(assignment.unique_name), 'view')}
            className={`relative bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-1.5 px-3 rounded transition-transform transform duration-200 h-10 min-w-[100px] ${loading.view ? 'scale-95 opacity-50' : ''}`} // Decreased size and padding
            disabled={loading.view}
          >
            {loading.view ? <span className="spinner" /> : 'View'}
          </button>
        )}
        {handleSubmitAssignment && (
          <button
            onClick={() => handleButtonClick(() => handleSubmitAssignment(assignment.unique_name), 'submit')}
            className={`relative bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-1.5 px-3 rounded transition-transform transform duration-200 h-10 min-w-[100px] ${loading.submit ? 'scale-95 opacity-50' : ''}`} // Decreased size and padding
            disabled={loading.submit}
          >
            {loading.submit ? <span className="spinner" /> : 'Submit'}
          </button>
        )}
        {handleDeleteAssignment && (
          <DeleteAssignment
            unique_name={assignment.unique_name}
            onDelete={() => handleButtonClick(() => handleDeleteAssignment(assignment.unique_name), 'delete')}
            loading={loading.delete}
          />
        )}
        {handleViewAssignmentReviewer && (
          <button
            onClick={() => handleButtonClick(() => handleViewAssignmentReviewer(assignment.unique_name), 'reviewer')}
            className={`relative bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-1.5 px-3 rounded transition-transform transform duration-200 h-10 min-w-[100px] ${loading.reviewer ? 'scale-95 opacity-50' : ''}`} // Decreased size and padding
            disabled={loading.reviewer}
          >
            {loading.reviewer ? <span className="spinner" /> : 'View '}
          </button>
        )}
      </div>

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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .flex-wrap {
            flex-direction: column;
          }
          .flex-wrap button {
            width: 100%;
            margin-bottom: 10px;
          }
        }
        @media (min-width: 641px) {
          .flex-wrap {
            flex-direction: row;
            justify-content: start;
          }
          .flex-wrap button {
            margin-right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AssignmentCard;
