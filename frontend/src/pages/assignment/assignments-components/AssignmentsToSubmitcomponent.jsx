// AssignmentsToSubmit.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssignmentsToSubmit = ({ assignmentsToSubmit, handleViewAssignment, formatDate }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Assignments to Submit</h2>
      {assignmentsToSubmit.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentsToSubmit.map(assignment => (
            <div
              key={assignment.unique_name}
              className="bg-white shadow-md p-6 rounded-xl text-black"
            >
              <h3 className="text-xl font-semibold">{assignment.name}</h3>
              <p>{assignment.description}</p>
              <p className="text-gray-500 mb-4">Due Date: {formatDate(assignment.deadline)}</p>

              <div className="flex flex-wrap justify-between">
                <button
                  onClick={() => handleViewAssignment(assignment.unique_name)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-2"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/submit-assignment/${assignment.unique_name}`)}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded mb-2"
                >
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No assignments to submit found.</p>
      )}
    </section>
  );
};

export default AssignmentsToSubmit;
