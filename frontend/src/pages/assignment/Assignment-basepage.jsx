import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../utilities/Navbar-main';
import SubtasksComponent from './subtasksComponent';
import SubmissionsComponent from './submissionsComponent';

const AssignmentBasePage = () => {
    const { unique_name } = useParams();
    const navigate = useNavigate();

    const handleBackToAssignments = () => {
        navigate('/assignments');
    };

    const handleAddSubtask = () => {
        navigate(`new-subtask/`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handleBackToAssignments}
                        className="bg-blue-200 text-white py-2 px-4 rounded hover:bg-lightblue-300"
                    >
                        Back to Assignments
                    </button>
                    <button
                        onClick={handleAddSubtask}
                        className="bg-green-200 text-black py-2 px-4 rounded hover:bg-green-300"
                    >
                        Add Subtasks
                    </button>
                </div>

                {/* Subtasks Section */}
                <SubtasksComponent unique_name={unique_name} />

                {/* Submissions Section */}
                <SubmissionsComponent unique_name={unique_name} />
            </div>
        </div>
    );
};

export default AssignmentBasePage;
