// IterationsComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const IterationsComponent = ({ unique_name }) => {
    const [iterations, setIterations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showIterations, setShowIterations] = useState(false);

    useEffect(() => {
        const fetchIterations = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/assignments/iterations/${unique_name}/`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('accessToken')}`, // Add your token here
                    },
                });
                setIterations(response.data.iterations);
            } catch (error) {
                setError('Error fetching iterations: ' + (error.response?.data?.error || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchIterations();
    }, [unique_name]);

    if (loading) return <p>Loading iterations...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div onClick={() => setShowIterations(!showIterations)} className="flex items-center cursor-pointer">
                {showIterations ? <FaChevronUp className="ml-2 text-xl" /> : <FaChevronDown className="ml-2 text-xl" />}
                <h1 className="text-3xl font-bold mb-4 text-black">Iterations:</h1>
            </div>
            {showIterations && (
                iterations.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">No iterations found for this assignment.</p>
                ) : (
                    <ul className="list-disc list-inside space-y-4 mt-4">
                        {iterations.map((iteration) => (
                            <li key={iteration.id} className="p-4 bg-white shadow-md rounded-lg transition duration-200 hover:shadow-lg">
                                <h1 className="font-semibold text-lg text-black">{iteration.title}</h1>
                                <p className="text-gray-600">{iteration.feedback}</p>
                                <p className="text-sm text-gray-500">Feedback by: {iteration.by_name} ({iteration.by_email})</p>
                                <p className="text-sm text-gray-500">Time Assigned: {new Date(iteration.time_assigned).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};

export default IterationsComponent;
