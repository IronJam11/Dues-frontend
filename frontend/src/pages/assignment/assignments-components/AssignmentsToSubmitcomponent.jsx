// AssignmentsToSubmit.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from './AssignmentCard';

const AssignmentsToSubmit = ({ assignmentsToSubmit, handleViewAssignment, formatDate }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Assignments to Submit</h2>
      {assignmentsToSubmit.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentsToSubmit.map(assignment => (
            <AssignmentCard
              key={assignment.unique_name}
              assignment={assignment}
              formatDate={formatDate}
              handleViewAssignment={handleViewAssignment}
              handleSubmitAssignment={(unique_name) => navigate(`/submit-assignment/${unique_name}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No assignments to submit found.</p>
      )}
    </section>
  );
};

export default AssignmentsToSubmit;
