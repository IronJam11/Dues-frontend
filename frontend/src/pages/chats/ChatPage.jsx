import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ChatPage() {
  const {enrollmentNo, userEnrollmentNo } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatMessagesRef = useRef(null);
  const socketRef = useRef(null);
  const initializedRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const unsavedMessagesRef = useRef([]);
  const unsavedMessagesIntervalRef = useRef(null);

  const initializeWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const roomName = `chat_${[enrollmentNo, userEnrollmentNo].sort().join('_')}`;
    const socketUrl = `${protocol}://${window.location.hostname}:8000/ws/${enrollmentNo}/${userEnrollmentNo}/`;

    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { enrollmentNo: data.enrollmentNo, content: data.message },
      ]);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = async (event) => {
      console.log('WebSocket connection closed', event);

      if (unsavedMessagesRef.current.length > 0) {
        await sendUnsavedMessages();
      }

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  };

  const fetchMessages = async () => {
    const roomName = `chat_${[enrollmentNo, userEnrollmentNo].sort().join('_')}`;
    try {
      const response = await axios.get(`http://127.0.0.1:8000/chats/dm/get/${roomName}/`);
      setMessages(response.data.messages);

      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  if (!initializedRef.current) {
    initializedRef.current = true;
    initializeWebSocket();
    fetchMessages();
  }

  const sendUnsavedMessages = async () => {
    if (unsavedMessagesRef.current.length > 0) {
      try {
        await Promise.all(
          unsavedMessagesRef.current.map(async (message) => {
            const messageData2 = {
              body: message.content,
              enrollmentNo: message.enrollmentNo,
              room: `chat_${[enrollmentNo, userEnrollmentNo].sort().join('_')}`,
              time_added: new Date().toISOString(),
            };
            await axios.post(`http://127.0.0.1:8000/chats/dm/store/`, messageData2);
          })
        );
        unsavedMessagesRef.current = []; // Clear after successful save
      } catch (error) {
        console.error('Error sending unsaved messages:', error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageData = {
      content: newMessage,
      enrollmentNo: enrollmentNo,
      room_slug: `chat_${[enrollmentNo, userEnrollmentNo].sort().join('_')}`,
      time_added: new Date().toISOString(),
      isLocal: true,
      user: enrollmentNo
    };

    setNewMessage('');
    unsavedMessagesRef.current.push(messageData);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
    } else {
      console.error('WebSocket is not open');
    }

    resetTypingTimeout();
  };

  const resetTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendUnsavedMessages();
    }, 100);  // Set the interval to 0.5 seconds (500 ms)
  };

  const handleDeleteMessages = async () => {
    const roomName = `chat_${[enrollmentNo, userEnrollmentNo].sort().join('_')}`;
    try {
      await axios.delete(`http://127.0.0.1:8000/chats/dm/delete/${roomName}/`);
      setMessages([]); // Clear the chat in the frontend
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    unsavedMessagesIntervalRef.current = setInterval(() => {
      sendUnsavedMessages();
    }, 100);  // Sends unsaved messages every 0.5 seconds

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (unsavedMessagesIntervalRef.current) {
        clearInterval(unsavedMessagesIntervalRef.current);
      }

      const delayClose = async () => {
        if (unsavedMessagesRef.current.length > 0) {
          await sendUnsavedMessages();
        }
      };

      delayClose();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="p-10 lg:p-20 text-center">
        <h1 className="text-4xl lg:text-5xl text-white font-bold">
          Chat with {userEnrollmentNo}
        </h1>
      </div>
      <div className="lg:w-3/4 w-full mx-4 lg:mx-auto p-4 bg-white rounded-2xl shadow-lg">
        <div
          className="chat-messages space-y-3 overflow-y-auto max-h-96 p-4"
          ref={chatMessagesRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.enrollmentNo === enrollmentNo
                  ? 'bg-teal-500 text-white self-end'
                  : 'bg-gray-200 text-black self-start'
              } rounded-lg p-3 max-w-xs lg:max-w-md break-words`}
            >
              <b>{msg.user ? msg.user : msg.enrollmentNo}</b>:  {msg.body ? msg.body : msg.content}
            </div>
          ))}
        </div>
      </div>

      {/* New Delete Button */}
      <div className="lg:w-3/4 w-full mx-4 lg:mx-auto mt-4">
        <button
          onClick={handleDeleteMessages}
          className="px-5 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg"
        >
          Delete All Messages
        </button>
      </div>

      <div className="lg:w-3/4 w-full mt-6 mx-4 lg:mx-auto p-4 bg-white rounded-2xl shadow-lg">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              resetTypingTimeout();
            }}
            className="flex-1 px-4 py-3 mr-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Your message..."
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl text-white bg-teal-600 hover:bg-teal-700 transition-all duration-200 shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
