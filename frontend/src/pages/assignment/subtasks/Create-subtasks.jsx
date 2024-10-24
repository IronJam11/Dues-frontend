// CreateSubtask.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../../utilities/Navbar-main';

const CreateSubtask = () => {
    const { unique_name } = useParams(); // Get unique_name from the URL
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        data.append('unique_name', unique_name);  // Append the unique name from the URL
        data.append('description', description); // Append the description from the form
        if (attachment) {
            data.append('attachment', attachment); // Append the file if it exists
        }
    
        try {
            console.log(data);
            const response = await axios.post('http://127.0.0.1:8000/assignments/subtask/create/', data, {
                withCredentials: true, // Use if you're handling cookies or session authentication
                headers: {
                    'Content-Type': 'multipart/form-data', // Set appropriate header for file upload
                },
            });
            
            console.log('Response:', response.data); // Log the response for debugging
            setMessage('Subtask created successfully!'); // Optionally show a success message
            // Optionally navigate to another page or clear the form
        } catch (error) {
            console.error('Error creating subtask:', error.response?.data || error.message); // Log error message
            setMessage('Error creating subtask: ' + (error.response?.data?.message || error.message)); // Show error message to the user
        }
    };
    

    return (
        <div>
       
            <div className="container mx-auto mt-5 p-5">
                <h1 className="text-2xl font-bold mb-4">Create Subtasks: </h1>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            id="description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="attachment" className="block text-gray-700 text-sm font-bold mb-2">Attachment:</label>
                        <input
                            type="file"
                            id="attachment"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={(e) => setAttachment(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create Subtask</button>
                </form>
                {message && <p className="text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default CreateSubtask;
