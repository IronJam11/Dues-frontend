// CreateTag.jsx
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main';
const CreateTag = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [condition, setCondition] = useState('');
    const [color, setColor] = useState('#FFFFFF');
    const [timeAdded, setTimeAdded] = useState(new Date().toISOString());

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/tags/create-tag/', {
                name,
                description,
                condition,
                color,
                time_added: timeAdded,
            });

            if (response.status === 201) {
                alert('Tag created successfully!');
            }
        } catch (error) {
            console.error('Error creating tag:', error);
            alert('Failed to create tag.');
        }
    };

    return (
        <>
        <div className="flex flex-col items-center mt-10">
            <h1 className="text-3xl font-bold mb-6">Create a New Tag</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="condition">
                        Condition
                    </label>
                    <input
                        type="text"
                        id="condition"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                        Color
                    </label>
                    <input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Tag
                </button>
            </form>
        </div>
        </>
    );
};

export default CreateTag;
