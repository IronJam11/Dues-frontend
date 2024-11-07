import React from 'react';

function EditAssignmentForm({
  name,
  setName,
  body,
  setBody,
  points,
  setPoints,
  deadline,
  setDeadline,
  availableUsers,
  selectedReviewers,
  setSelectedReviewers,
  selectedReviewees,
  setSelectedReviewees,
  handleUserSelect,
  handleSubmit,
}) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl animate-fadeIn">
        {/* Header with gradient background */}
        <div className="relative mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Assignment
          </h2>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full" />
        </div>

        {/* Assignment Name Input */}
        <div className="mb-6 group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-hover:text-purple-600">
            Assignment Name
          </label>
          <input
            type="text"
            placeholder="Enter assignment name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400
                     transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                     hover:border-purple-300 bg-gray-50 hover:bg-white"
          />
        </div>

        {/* Description Textarea */}
        <div className="mb-6 group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-hover:text-purple-600">
            Description
          </label>
          <textarea
            placeholder="Describe the assignment"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400
                     transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                     hover:border-purple-300 bg-gray-50 hover:bg-white resize-none"
          />
        </div>

        {/* Points and Deadline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-hover:text-purple-600">
              Points
            </label>
            <input
              type="number"
              placeholder="Assignment points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400
                       transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                       hover:border-purple-300 bg-gray-50 hover:bg-white"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 transition-all duration-200 group-hover:text-purple-600">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-800
                       transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                       hover:border-purple-300 bg-gray-50 hover:bg-white"
            />
          </div>
        </div>

        {/* Reviewers Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Reviewers
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
            {availableUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email, 'reviewer')}
                    checked={selectedReviewers.includes(user.email)}
                    className="w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-purple-500 transition-all duration-200"
                  />
                </div>
                <span className="ml-3 text-gray-700 font-medium">{user.name}</span>
                <span className="ml-2 text-sm text-gray-500">({user.email})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviewees Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Reviewees
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
            {availableUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    value={user.email}
                    onChange={() => handleUserSelect(user.email, 'reviewee')}
                    checked={selectedReviewees.includes(user.email)}
                    className="w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-purple-500 transition-all duration-200"
                  />
                </div>
                <span className="ml-3 text-gray-700 font-medium">{user.name}</span>
                <span className="ml-2 text-sm text-gray-500">({user.email})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold
                     transition-all duration-300 transform hover:scale-105 hover:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-purple-300
                     active:scale-95"
          >
            Update Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAssignmentForm;