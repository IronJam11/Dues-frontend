import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SubmissionsReviewerComponent = ({ unique_name }) => {
    const [submissions, setSubmissions] = useState([]); // Initialize as an empty array
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/assignments/list-submissions/${unique_name}/`);
                setSubmissions(response.data.submissions || []); // Ensure it's always an array
            } catch (error) {
                setError('Error fetching submissions: ' + (error.response?.data?.error || error.message));
            } finally {
                setLoading(false);
            }
        };
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

    const handleReviewSubmission = (unique_submission_name) => {
        navigate(`/submission/review/${unique_submission_name}`);
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div onClick={() => setShowSubmissions(!showSubmissions)} className="flex items-center cursor-pointer">
                {showSubmissions ? <FaChevronUp className="ml-2 text-xl" /> : <FaChevronDown className="ml-2 text-xl" />}
                <h1 className="text-3xl font-bold mt-8 mb-4 text-black"> Submissions:</h1>
            </div>
            {showSubmissions && (
                loading ? (
                    <p className="text-center text-lg text-gray-600">Loading submissions...</p>
                ) : (
                    Array.isArray(submissions) && submissions.length === 0 ? (
                        <p className="text-center text-lg text-gray-600">No submissions found for this assignment.</p>
                    ) : (
                        <ul className="list-disc list-inside space-y-4 mt-4">
                            {submissions.map((submission) => (
                                <li key={submission.unique_submission_name} className="p-4 bg-white shadow-md rounded-lg transition duration-200 hover:shadow-lg">
                                    <h1 className="font-semibold text-lg text-black">Submitted by: {submission.user}</h1>
                                    <p className="text-gray-700 mt-2">Description: {submission.description}</p>
                                    <p className="text-gray-700 mt-2">Points Awarded: {submission.points_awarded ?? 'Not graded yet'}</p>
                                    <p className="text-gray-700 mt-2">Submitted on: {new Date(submission.time_submitted).toLocaleString()}</p>
                                    <p className="text-gray-700 mt-2">Unique name: {submission.unique_submission_name}</p>
                                    <p className="text-gray-700 mt-2 font-semibold">Status: {submission.status}</p>
                                    <div className="mt-2 flex items-center">
                                        {submission.files.length > 0 && (
                                            <button
                                                onClick={() => handleDownloadAllFiles(submission.files)}
                                                className="bg-pink-200 text-black py-2 px-4 rounded hover:bg-pink-300 mr-2"
                                            >
                                                Download All Files
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleReviewSubmission(submission.unique_submission_name)}
                                            className="bg-blue-200 text-black py-2 px-4 rounded hover:bg-blue-300"
                                        >
                                            Review
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                )
            )}
        </div>
    );
};

export default SubmissionsReviewerComponent;