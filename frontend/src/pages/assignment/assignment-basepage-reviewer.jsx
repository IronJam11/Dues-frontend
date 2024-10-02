import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import Navbar from '../../utilities/Navbar-main';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing icons

const AssignmentBaseReviewPage = () => {
    const { unique_name } = useParams();
    const navigate = useNavigate();
    const [subtasks, setSubtasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSubtasks, setShowSubtasks] = useState(false); // State for toggling subtasks
    const [showSubmissions, setShowSubmissions] = useState(false); // State for toggling submissions

    useEffect(() => {
        const fetchSubtasks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/assignments/subtasks/${unique_name}/`);
                setSubtasks(response.data.subtasks);
            } catch (error) {
                setError('Error fetching subtasks: ' + (error.response?.data?.error || error.message));
            } finally {
                setLoading(false);
            }
        };

        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/assignments/list-submissions/${unique_name}/`);
                setSubmissions(response.data.submissions);
            } catch (error) {
                setError('Error fetching submissions: ' + (error.response?.data?.error || error.message));
            }
        };

        fetchSubtasks();
        fetchSubmissions();
    }, [unique_name]);

    const handleDownloadAllFiles = async (files) => {
        const zip = new JSZip();
        const filePromises = files.map(async (file) => {
            const response = await axios.get(file.file_url, { responseType: 'blob' });
            const fileName = file.file_url.split('/').pop();
            zip.file(fileName, response.data);
        });

        try {
            await Promise.all(filePromises);
            const content = await zip.generateAsync({ type: 'blob' });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `submission_files.zip`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading files:', error);
            alert('Error downloading files. Please try again.');
        }
    };

    const handleBackToAssignments = () => {
        navigate('/assignments');
    };

    const handleAddSubtask = () => {
        navigate(`new-subtask/`);
    };

    const handleReviewSubmission = (submissionId) => {
        // Navigate to the review page for the specific submission
        navigate(`/review-submission/${submissionId}`);
    };

    if (loading) return <p className="text-center mt-4">Loading subtasks...</p>;
    if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

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
                <div>
                    <div onClick={() => setShowSubtasks(!showSubtasks)} className="flex items-center cursor-pointer">
                        {showSubtasks ? <FaChevronUp className="ml-2 text-xl" /> : <FaChevronDown className="ml-2 text-xl" />}
                        <h1 className="text-3xl font-bold mb-4 text-black">Subtasks:</h1>
                    </div>
                    {showSubtasks && (
                        subtasks.length === 0 ? (
                            <p className="text-center text-lg text-gray-600">No subtasks found for this assignment.</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-4 mt-4">
                                {subtasks.map((subtask) => (
                                    <li key={subtask.id} className="p-4 bg-white shadow-md rounded-lg transition duration-200 hover:shadow-lg">
                                        <h1 className="font-semibold text-lg text-black">{subtask.description}</h1>
                                        <div className="mt-2">
                                            {subtask.attachment && (
                                                <>
                                                    <button
                                                        onClick={() => handleFileAccess(subtask.attachment)}
                                                        className="bg-pink-200 text-black py-2 px-4 rounded hover:bg-pink-300 mr-2"
                                                    >
                                                        Download Attachment
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>

                {/* Submissions Section */}
                <div>
                    <div onClick={() => setShowSubmissions(!showSubmissions)} className="flex items-center cursor-pointer">
                        {showSubmissions ? <FaChevronUp className="ml-2 text-xl" /> : <FaChevronDown className="ml-2 text-xl" />}
                        <h1 className="text-3xl font-bold mt-8 mb-4 text-black">My Submissions:</h1>
                    </div>
                    {showSubmissions && (
                        submissions.length === 0 ? (
                            <p className="text-center text-lg text-gray-600">No submissions found for this assignment.</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-4 mt-4">
                                {submissions.map((submission) => (
                                    <li key={submission.id} className="p-4 bg-white shadow-md rounded-lg transition duration-200 hover:shadow-lg">
                                        <h1 className="font-semibold text-lg text-black">Submitted by: {submission.user}</h1>
                                        <p className="text-gray-700 mt-2">Description: {submission.description}</p>
                                        <p className="text-gray-700 mt-2">Points Awarded: {submission.points_awarded ?? 'Not graded yet'}</p>
                                        <p className="text-gray-700 mt-2">Submitted on: {new Date(submission.time_submitted).toLocaleString()}</p>
                                        <div className="mt-2">
                                            {submission.files.length > 0 && (
                                                <>
                                                    <button
                                                        onClick={() => handleDownloadAllFiles(submission.files)}
                                                        className="bg-pink-200 text-black py-2 px-4 rounded hover:bg-pink-300 mr-2"
                                                    >
                                                        Download All Files
                                                    </button>
                                                </>
                                            )}
                                            {/* Review Button */}
                                            <button
                                                onClick={() => handleReviewSubmission(submission.id)}
                                                className="bg-yellow-200 text-black py-2 px-4 rounded hover:bg-yellow-300"
                                            >
                                                Review Submission
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentBaseReviewPage;
