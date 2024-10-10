import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main';
import { FaCoins } from 'react-icons/fa';
import Cookies from 'js-cookie'

function GroupChatPage() {
  const { enrollmentNo, room } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [userEmailDetails, setUserEmailDetails] = useState([]);
  const chatMessagesRef = useRef(null);
  const socketRef = useRef(null);
  const initializedRef = useRef(false);
  const [isAdmin, setIsAdmin] = useState("false");


  // Fetch room details including participants and admins
  const fetchRoomDetails = async () => {
    try {
      const token = Cookies.get('accessToken')
      const response = await axios.get("http://127.0.0.1:8000/users/user-data/", 
        { 
          withCredentials: true,
          headers:
          {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const enrollmentNo = response.data.enrollmentNo;
      const isAdminRequest = await axios.post(`http://127.0.0.1:8000/chats/groupchat/isAdmin/`,
        {
          "slug": room,
          "enrollmentNo": enrollmentNo,
        }, { withCredentials: true }
      );
      setIsAdmin(isAdminRequest.data.isAdmin);
      console.log("isadmin:- ",isAdmin);
    } catch (error) {
      console.error("error", error);
    }
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/chats/groupchat/get/room-details/${room}/`
      );
      setRoomDetails(response.data);
      setParticipants(response.data.participants);
      setAdmins(response.data.admins);
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/chats/groupchat/get/room-messages/${room}/`
      );
      setMessages([...response.data.messages]);

      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/users/all-users-details-enrollmentNo/`
      );
      setUserDetails(response.data.users);
    } catch (error) {
      console.error('Error fetching users data:', error);
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/users/all-users-details-email/`
      );
      setUserEmailDetails(response.data.users);
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  };

  // Initialize WebSocket for messages
  const initializeWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socketUrl = `${protocol}://${window.location.hostname}:8000/ws/group/${room}/${enrollmentNo}/`;
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

    socketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };
  };

  // Promote a participant to admin
  const promoteToAdmin = async (participantEmail) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/chats/groupchat/add-admin/`,
        { email: participantEmail, slug: room, enrollmentNo: enrollmentNo }
      );
      fetchRoomDetails();
    } catch (error) {
      console.error('Error promoting user to admin:', error);
    }
  };

  // Remove a participant from the room
  const removeParticipant = async (participantEmail) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/chats/groupchat/remove-user/`,
        { email: participantEmail, slug: room, enrollmentNo: enrollmentNo }
      );
      fetchRoomDetails();
    } catch (error) {
      console.error('Error removing participant:', error);
      alert("You are not admin. You cannot remove participants.");
    }
  };

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
  
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
      
      // Scroll down to the bottom after sending the message
      if (chatMessagesRef.current) {
        setTimeout(() => {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }, 100); // small timeout to ensure the DOM updates before scrolling
      }
    }
  
    setNewMessage(''); // Clear the input after sending
  };

  // Navigate to Add Users page
  const handleAddUsers = () => {
    navigate(`/projects/project-chat/${enrollmentNo}/${room}/add-users`);
  };

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchUsers();
      fetchMessages();
      initializeWebSocket();
      fetchRoomDetails();
    }
  }, []);

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      {/* Left Section: Chat */}
      <div className="lg:w-3/4 w-full p-10 lg:p-20 text-center bg-gray-100">
        <h1 className="text-3xl lg:text-4xl text-black font-bold mb-4">
          Chatting with group {roomDetails ? roomDetails.room_name : '...'}
        </h1>

        {/* Add Users Button */}
        <button
          onClick={handleAddUsers}
          className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 mb-4"
        >
          Add Users
        </button>

        {roomDetails && (
          <p className="text-black text-lg mb-4">
            {roomDetails.room_name} - Created on:{' '}
            {new Date(roomDetails.time_created).toLocaleDateString()}
          </p>
        )}

<div className="p-4 bg-white rounded-lg shadow-md overflow-hidden">
  <div
    className="chat-messages space-y-3 overflow-y-auto max-h-96 p-4"
    ref={chatMessagesRef}
  >
    {messages.map((msg, index) => {
      const currentUser = msg.user
        ? userDetails[msg.user]
        : userDetails[msg.enrollmentNo];
      const profilePicture = currentUser?.profilePicture
        ? `http://127.0.0.1:8000${currentUser.profilePicture}/`
        : `http://127.0.0.1:8000${userDetails[msg.enrollmentNo]?.profilePicture}/`;
      const displayName = currentUser?.name ? currentUser.name : '...';

      return (
        <div key={index} className={`flex ${msg.user === enrollmentNo || msg.enrollmentNo === enrollmentNo ? 'justify-end' : 'justify-start'} space-x-2`}>
          {!(msg.user === enrollmentNo || msg.enrollmentNo === enrollmentNo) && (
            <img
              src={profilePicture}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div
            className={`${
              msg.user === enrollmentNo || msg.enrollmentNo === enrollmentNo
                ? 'bg-teal-100 text-black self-end'
                : 'bg-gray-200 text-black self-start'
            } rounded-lg p-3 max-w-xs lg:max-w-md break-words`}
          >
            <b>{displayName}</b>: {msg.content}
          </div>
          {msg.user === enrollmentNo || msg.enrollmentNo === enrollmentNo && (
            <img
              src={profilePicture}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          )}
        </div>
      );
    })}
  </div>
</div>


        {/* Send Message Form */}
        <div className="lg:w-full w-full mt-6 mx-4 lg:mx-auto p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-3 mr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your message..."
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-lg text-white bg-teal-500 hover:bg-teal-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Right Section: Participants and Admins */}
      <div className="lg:w-1/4 w-full bg-gray-200 p-4 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
  <h2 className="text-xl font-semibold mb-2">Participants</h2>
  <ul className="mb-6">
    {participants.map((participant) => {
      const currentUser = participant.enrollmentNo
      ? userDetails[participant.enrollmentNo]
      : userDetails[participant.user]; // Fetch details using enrollmentNo
      const displayName = currentUser?.name ? currentUser.name : '...';
      return (
        <li
          key={participant.enrollmentNo}
          className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-300"
        >
          <span>{displayName}</span> {/* Display name instead of email */}
          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={() => promoteToAdmin(participant.enrollmentNo)}
                className="text-blue-500 hover:underline bg-white p-2 rounded-lg"
              >
                Promote to Admin
              </button>
              <button
                onClick={() => removeParticipant(participant.enrollmentNo)}
                className="text-red-500 hover:underline bg-white p-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          )}
        </li>
      );
    })}
  </ul>

  <h2 className="text-xl font-semibold mb-2">Admins</h2>
  <ul>
    {admins.map((admin) => {
      const currentUser = admin.enrollmentNo
      ? userDetails[admin.enrollmentNo]
      : userDetails[admin.user]; // Fetch details using enrollmentNo
      const displayName = currentUser?.name ? currentUser.name : '...'; // Fetch details using enrollmentNo
      return (
        <li key={admin.email} className="p-2 rounded-lg hover:bg-gray-300">
          <span>{displayName}</span> {/* Display name instead of email */}
        </li>
      );
    })}
  </ul>
</div>

    </div>
    </>
  );
}

export default GroupChatPage;
