import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ReviewSubmissionPage = () => {
    const { unique_submission_name } = useParams(); // Get unique submission name from URL params
    const [submission, setSubmission] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [points, setPoints] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/assignments/submission-details/${unique_submission_name}/`);
                setSubmission(response.data);
            } catch (err) {
                setError('Error fetching submission details: ' + (err.response?.data?.error || err.message));
            }
        };

        fetchSubmissionDetails();
    }, [unique_submission_name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send feedback, points, and status to your backend API
            await axios.post(`http://127.0.0.1:8000/submissions/${unique_submission_name}/review/`, {
                feedback,
                points,
                status,
            });
            alert('Review submitted successfully!');
            navigate(`/submissions`); // Redirect to the submissions list or any other page
        } catch (err) {
            setError('Error submitting review: ' + (err.response?.data?.error || err.message));
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto mt-8">
            {submission ? (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Submission Details</h1>
                    <p><strong>User:</strong> {submission.user}</p>
                    <p><strong>Assignment:</strong> {submission.assignment}</p>
                    <p><strong>Description:</strong> {submission.description}</p>
                    <p><strong>Time Submitted:</strong> {new Date(submission.time_submitted).toLocaleString()}</p>
                    <p><strong>Status:</strong> {submission.status}</p>
                    <p><strong>Points Awarded:</strong> {submission.points_awarded ?? 'Not graded yet'}</p>
                    <h2 className="text-xl font-semibold mt-4">Files:</h2>
                    <ul className="list-disc list-inside">
                        {submission.files.map((file) => (
                            <li key={file.id}>
                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {file.file_url.split('/').pop()} {/* Show only the file name */}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <h2 className="text-xl font-semibold mt-4">Submit Review</h2>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div>
                            <label htmlFor="feedback" className="block mb-2">Feedback:</label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="border p-2 w-full"
                                rows="4"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="points" className="block mb-2">Points Awarded:</label>
                            <input
                                type="number"
                                id="points"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                className="border p-2 w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2">Status:</label>
                            <input
                                type="text"
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border p-2 w-full"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
                            Submit Review
                        </button>
                    </form>
                </div>
            ) : (
                <p>Loading submission details...</p>
            )}
        </div>
    );
};

export default ReviewSubmissionPage;
