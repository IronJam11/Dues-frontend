// TagList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import Navbar from '../../utilities/Navbar-main';

const TagList = () => {
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();  // Initialize useNavigate for redirection

    // Fetch all tags from the API
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tags/');
                setTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    return (
        <>
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">All Tags</h1>

            {/* Add the "Create New" button */}
            <div className="flex justify-end mb-4">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() => navigate('create-tags')}  // Redirect to /create-tags
                >
                    Create New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tags.map(tag => (
                    <div 
                        key={tag.id} 
                        className="p-4 rounded shadow-md" 
                        style={{ backgroundColor: tag.color }}
                    >
                        <h2 className="text-xl font-bold text-white">{tag.name}</h2>
                        <p className="text-white">{tag.description}</p>
                        <p className="text-sm text-white mt-2">Condition: {tag.condition}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default TagList;
