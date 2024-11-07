// src/LoadingPage.jsx
import React from 'react';

const LoadingPage = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
            <p className="mt-2 text-gray-500">Please wait while we fetch the content.</p>
        </div>
    );
};

export default LoadingPage;
