import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const enrollmentNo = localStorage.getItem('enrollmentNo'); // Get the current user's enrollment number

    const fetchUsers = async (query) => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/users/search/', {
                params: { query },
            });
            setUsers(response.data.users);
        } catch (error) {
            setError('Error fetching users: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query !== '') {
            fetchUsers(query);
        } else {
            setUsers([]); // Reset users when search query is empty
        }
    }, [query]);

    const handleChatClick = (userEnrollmentNo) => {
        if (enrollmentNo) {
            navigate(`/${enrollmentNo}/${userEnrollmentNo}`);
        }
    };

    const handleInfoClick = (userEnrollmentNo) => {
        navigate(`/user-info/${userEnrollmentNo}`); // Replace with the appropriate route for user info
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by enrollmentNo, name, or alias"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm"
            />
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {users.map((user) => (
                    <li 
                        key={user.enrollmentNo} 
                        className="flex items-center p-4 bg-white shadow-md rounded-lg"
                    >
                        <img 
                            src={`http://127.0.0.1:8000${user.profilePicture}`} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full mr-4" 
                        />
                        <div className="flex-1 text-left">
                            <h2 className="font-semibold text-lg text-black">
                                {user.name} ({user.alias})
                            </h2>
                            <p className="text-black">Enrollment No: {user.enrollmentNo}</p>
                            <p className="text-black">Email: {user.email}</p>
                            <p className="text-black">Year: {user.year}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleChatClick(user.enrollmentNo)}
                                className="px-4 py-2 bg-pink-200 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
                            >
                                Chat
                            </button>
                            <button
                                onClick={() => handleInfoClick(user.enrollmentNo)}
                                className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-full hover:bg-gray-700 transition duration-300"
                            >
                                Info
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
