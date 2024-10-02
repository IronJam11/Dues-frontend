import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';

const SubtasksComponent = ({ unique_name }) => {
    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSubtasks, setShowSubtasks] = useState(false);

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
        fetchSubtasks();
    }, [unique_name]);

    const handleFileAccess = async (fileUrl) => {
        try {
            const response = await axios.get(fileUrl, { responseType: 'blob' });
            const fileName = fileUrl.split('/').pop();
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Error downloading file. Please try again.');
        }
    };

    if (loading) return <p>Loading subtasks...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
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
                                {subtask.attachment && (
                                    <button
                                        onClick={() => handleFileAccess(subtask.attachment)}
                                        className="bg-pink-200 text-black py-2 px-4 rounded hover:bg-pink-300 mr-2"
                                    >
                                        Download Attachment
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};

export default SubtasksComponent;
