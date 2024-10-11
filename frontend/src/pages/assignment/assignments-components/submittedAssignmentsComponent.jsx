// SubmittedAssignments.js
import React from 'react';

const SubmittedAssignments = ({ submittedAssignments, handleViewAssignment }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Submitted Assignments</h2>
      {submittedAssignments && submittedAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submittedAssignments.map(assignment => (
            <div
              key={assignment.unique_name}
              className="bg-white shadow-md p-6 rounded-xl text-black"
            >
              <h3 className="text-xl font-semibold">{assignment.assignment_name}</h3>
              <p>{assignment.description}</p>
              <p>Reviewed by: {assignment.reviewer}</p>
              <p>Points earned: {assignment.score}/{assignment.max_points}</p>

              <button
                onClick={() => handleViewAssignment(assignment.unique_name)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No submitted assignments found.</p>
      )}
    </section>
  );
};

export default SubmittedAssignments;
