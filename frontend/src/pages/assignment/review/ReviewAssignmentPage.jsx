import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../utilities/Navbar-main';
import Cookies from 'js-cookie'

const ReviewSubmissionPage = () => {
    const { unique_submission_name } = useParams();
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
            console.log(submission);
        };

        fetchSubmissionDetails();
    }, [unique_submission_name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://127.0.0.1:8000/assignments/review/`, {

                'feedback':feedback,
                'points':points,
                'status':status,
                'unique_submission_name': unique_submission_name,
            }, 
        {
            headers:
            {
                Authorization: `Bearer ${Cookies.get('accessToken')}`
            }
        });
            alert('Review submitted successfully!');
            navigate(`/submissions`);
        } catch (err) {
            setError('Error submitting review: ' + (err.response?.data?.error || err.message));
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-16">
                {submission ? (
                    <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white">
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
                                        {file.file_url.split('/').pop()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <h2 className="text-xl font-semibold mt-4">Submit Review</h2>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div>
                                <label htmlFor="feedback" className="block mb-2 font-medium">Feedback:</label>
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded-lg"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="status" className="block mb-2 font-medium">Status:</label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded-lg"
                                    required
                                >
                                    <option value="" disabled>Select status</option>
                                    <option value="approved">Approved</option>
                                    <option value="Marked for another iteration">Marked for another iteration</option>
                                </select>
                            </div>
                            {status === 'approved' && (
                                <div className="mt-4">
                                    <label htmlFor="points" className="block mb-2 font-medium">Points Awarded:</label>
                                    <input
                                        type="number"
                                        id="points"
                                        value={points}
                                        onChange={(e) => setPoints(e.target.value)}
                                        className="border border-gray-300 p-2 w-full rounded-lg"
                                        required
                                    />
                                </div>
                            )}
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 transition duration-200">
                                Submit Review
                            </button>
                        </form>
                    </div>
                ) : (
                    <p className="mt-4">Loading submission details...</p>
                )}
            </div>
        </>
    );
};

export default ReviewSubmissionPage;
