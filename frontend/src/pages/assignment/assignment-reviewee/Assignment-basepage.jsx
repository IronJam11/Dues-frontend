import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../utilities/Navbar-main';
import SubmissionsRevieweeComponent from '../submit/submissionsComponentReviewee';
import SubmissionsReviewerComponent from '../submit/submissionsComponentReviewer';
import SubtasksComponent from '../subtasks/subtasksComponent';
import IterationsComponent from '../iterations/IterationsComponent'; // Import the new Iterations component
import axios from 'axios';
import Cookies from 'js-cookie';

const AssignmentBasePage = () => {
    const { unique_name } = useParams();
    const navigate = useNavigate();

    const [isReviewer, setIsReviewer] = useState(false); // Track if the user is a reviewer
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track any error from the API call

    const checkPermission = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/assignments/check-permission/${unique_name}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            if (response.data.has_permission) {
                setIsReviewer(true);
            } else {
                setIsReviewer(false);
            }
        } catch (err) {
            setError('Error checking permission.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkPermission();
    }, [unique_name]);

    const handleBackToAssignments = () => {
        navigate('/assignments');
    };

    const handleAddSubtask = () => {
        navigate(`new-subtask/`);
    };

    if (loading) {
        return <div>Loading...</div>;  
    }

    if (error) {
        return <div>{error}</div>;  
    }

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

                {/* Conditionally Render Submissions Component based on permission */}
                {isReviewer ? (
                    <SubmissionsReviewerComponent unique_name={unique_name} />
                ) : (
                    <SubmissionsRevieweeComponent unique_name={unique_name} />
                )}

                {/* Conditionally Render Iterations Component for Reviewee */}
                {!isReviewer && <IterationsComponent unique_name={unique_name} />}
            </div>
        </div>
    );
};

export default AssignmentBasePage;
