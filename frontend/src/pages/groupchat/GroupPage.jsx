import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import Navbar from '../../utilities/Navbar-main';
import { FaCoins } from 'react-icons/fa';
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
  const [isAdmin,setIsAdmin] = useState("false");
  

  // Fetch room details including participants and admins
  const fetchRoomDetails = async () => {
    try
    {
      const response = await axios.get("http://127.0.0.1:8000/users/get-enrollmentNo/", {withCredentials : true});
      const enrollmentNo = response.data.enrollmentNo;
      const isAdminRequest = await axios.post(`http://127.0.0.1:8000/chats/groupchat/isAdmin/`,
        {
          "slug":room,
          "enrollmentNo":enrollmentNo,

        }, { withCredentials: true}
      )
      setIsAdmin(isAdminRequest.data.isAdmin);
      console.log(isAdmin);
    } catch(error)
    {
      console.error("error",error);
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
        { email: participantEmail, slug: room, enrollmentNo: enrollmentNo}
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
    }
    setNewMessage('');
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Navbar /> 
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
                <div key={index} className="flex items-start space-x-2">
                  <img
                    src={profilePicture}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div
                    className={`${
                      msg.user === enrollmentNo || msg.enrollmentNo === enrollmentNo
                        ? 'bg-teal-100 text-black self-end'
                        : 'bg-gray-200 text-black self-start'
                    } rounded-lg p-3 max-w-xs lg:max-w-md break-words`}
                  >
                    <b>{displayName}</b>: {msg.content}
                  </div>
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
              className="px-5 py-3 rounded-lg text-white bg-teal-500 hover:bg-teal-600 transition-all duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Right Section: Participants and Admins */}
      <div className="lg:w-1/4 w-full p-6 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-black">Participants</h2>
        <div className="space-y-2">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-black">
                {userEmailDetails[participant.email]
                  ? userEmailDetails[participant.email]['name']
                  : participant.email}
              </span>
              <div className="flex space-x-2">
                {/* Conditionally render buttons based on isAdmin */}
                {isAdmin === "true" && (
                  <>
                    <button
                      className="text-red-600"
                      onClick={() => removeParticipant(participant.email)}
                    >
                      Remove
                    </button>
                    <button
                      className="text-blue-600"
                      onClick={() => promoteToAdmin(participant.email)}
                    >
                      Promote to Admin
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 text-black">Admins</h2>
        <div className="space-y-2">
          {admins.map((admin, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-black">
                {userEmailDetails[admin.email]
                  ? userEmailDetails[admin.email]['name']
                  : admin.email}
              </span>
              <div className="flex space-x-2">
                {/* Conditionally render buttons based on isAdmin */}
                {isAdmin === "true" && (
                  <>
                    <button
                      className="text-red-600"
                      onClick={() => removeParticipant(admin.email)}
                    >
                      Remove
                    </button>
                    <button
                      className="text-blue-600"
                      onClick={() => promoteToAdmin(admin.email)}
                    >
                      Promote to Admin
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default GroupChatPage;
