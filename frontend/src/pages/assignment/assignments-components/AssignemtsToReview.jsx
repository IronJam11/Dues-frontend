// AssignmentsToReview.js
import React from 'react';
import AssignmentCard from './AssignmentCard';

const AssignmentsToReview = ({ 
  assignmentsToReview, 
  handleEditAssignment, 
  handleAddSubtasks, 
  handleViewAssignmentReviewer, 
  handleDeleteAssignment, 
  formatDate 
}) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-black">Assignments to Review</h2>
      {assignmentsToReview.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentsToReview.map(assignment => (
            <AssignmentCard
              key={assignment.unique_name}
              assignment={assignment}
              handleEditAssignment={handleEditAssignment}
              handleAddSubtasks={handleAddSubtasks}
              handleViewAssignmentReviewer={handleViewAssignmentReviewer}
              handleDeleteAssignment={handleDeleteAssignment}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No assignments to review found.</p>
      )}
    </section>
  );
};

export default AssignmentsToReview;
