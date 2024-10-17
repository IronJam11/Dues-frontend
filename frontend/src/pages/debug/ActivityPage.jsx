import React from 'react';
import WebSocketStatus from '../../utilities/UserActivitystatus'; // Import the component

const UserActivityStatus = () => {
    return (
        <div>
            <h1>Welcome to the Page</h1>
            <WebSocketStatus /> {/* WebSocketStatus component */}
        </div>
    );
};

export default UserActivityStatus;
