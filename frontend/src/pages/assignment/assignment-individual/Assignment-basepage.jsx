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

    const [isReviewer, setIsReviewer] = useState(false); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const checkPermission = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/assignments/check-permission/${unique_name}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            console.log(response.data);
            if (response.data.has_permission) {
                setIsReviewer(true);
            } else {
                setIsReviewer(false);
            }
            console.log("The user is a reviewer ?", isReviewer);
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
        navigate(-1);
    };

    const notifyReviweee = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/notifications/notify-reviewees/`,
                {
                    'unique_name': unique_name,
                    'message':`Assignment ${unique_name} is pending`,
                    'type':'reminder',
                },
                {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            alert("Reviewees notified!");
        } catch (err) {
            setError('Error notifying reviewee.');
            alert("Failed to notify reviewees");
            console.error(err);
        }
    };

    const handleAddSubtask = () => {
        navigate(`new-subtask/`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={handleBackToAssignments}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                        Back to Assignments
                    </button>
                    <button
                        onClick={notifyReviweee}
                        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200"
                    >
                       Notify Reviewees
                    </button>
                    <button
                        onClick={handleAddSubtask}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-200"
                    >
                        Add Subtasks
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <SubtasksComponent unique_name={unique_name} />
                </div>

    
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    {isReviewer ? (
                        <SubmissionsReviewerComponent unique_name={unique_name} />
                    ) : (
                        <SubmissionsRevieweeComponent unique_name={unique_name} />
                    )}
                </div>

                {!isReviewer && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <IterationsComponent unique_name={unique_name} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentBasePage;
