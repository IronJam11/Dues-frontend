// AssignmentsToReview.js
import React from 'react';
import DeleteAssignment from '../../../functions/handleDeleteAssignment';

const AssignmentsToReview = ({ assignmentsToReview, handleEditAssignment, handleAddSubtasks, handleViewAssignmentReviewer, handleDeleteAssignment, formatDate }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Assignments to Review</h2>
      {assignmentsToReview.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentsToReview.map(assignment => (
            <div
              key={assignment.unique_name} 
              className="bg-white shadow-md p-6 rounded-xl text-black"
            >
              <h3 className="text-xl font-semibold">{assignment.name}</h3>
              <p>{assignment.description}</p>
              <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

              <div className="flex flex-wrap justify-between">
                <button
                  onClick={() => handleEditAssignment(assignment.unique_name)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded mb-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleAddSubtasks(assignment.unique_name)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded mb-2"
                >
                  Add Subtasks
                </button>
                <button
                  onClick={() => handleViewAssignmentReviewer(assignment.unique_name)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-2"
                >
                  View
                </button>
                <DeleteAssignment 
                  unique_name={assignment.unique_name} 
                  onDelete={handleDeleteAssignment}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No assignments to review found.</p>
      )}
    </section>
  );
};

export default AssignmentsToReview;
