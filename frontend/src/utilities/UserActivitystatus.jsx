import React, { useState, useEffect } from 'react';

const WebSocketStatus = () => {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        let wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const socket = new WebSocket(`${wsProtocol}://${window.location.host}/ws/status/`);

        socket.onopen = () => {
            setIsOnline(true); // User is online when the WebSocket connection is open
        };

        socket.onclose = () => {
            setIsOnline(false); // User is offline when the WebSocket connection is closed
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setIsOnline(false); // Handle error by marking the user offline
        };

        return () => {
            socket.close(); // Close WebSocket connection when the component is unmounted
        };
    }, []);

    return (
        <div className="user-status">
            <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
        </div>
    );
};

export default WebSocketStatus;
