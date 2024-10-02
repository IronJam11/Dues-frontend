import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../../utilities/Navbar-main';

const AssignmentSubmissionPage = () => {
    const { unique_name } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const enrollmentNo = localStorage.getItem('enrollmentNo');

    const handleFileChange = (event) => {
        setFiles([...files, ...event.target.files]);
    };

    const handleFileRemove = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('enrollment_no', enrollmentNo);
        formData.append('unique_name', unique_name);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/assignments/submit-assignment/`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setSuccess('Submission successful!');
            setError('');
            // navigate(`/assignments/${unique_name}`); // Redirect after submission if needed
        } catch (error) {
            setError('Error submitting assignment: ' + (error.response?.data?.error || error.message));
            setSuccess('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6 text-black">Submit Assignment</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                            placeholder="Enter a description for your submission"
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-black text-sm font-bold mb-2" htmlFor="files">
                            Upload Files
                        </label>
                        <input
                            id="files"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        {files.length > 0 && (
                            <div>
                                <h3 className="text-black text-sm font-bold mb-2">Files to be uploaded:</h3>
                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index} className="flex text-black items-center justify-between">
                                            <span> - {file.name}</span>
                                            <button
                                                type="button"
                                                className="text-white hover:text-red-700 ml-4"
                                                onClick={() => handleFileRemove(index)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-200 text-white py-2 px-4 rounded hover:bg-blue-300"
                    >
                        Submit Assignment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssignmentSubmissionPage;
