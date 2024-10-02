import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function SendEmailPage() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPassword, setSenderPassword] = useState('');
  const [smtpServer, setSmtpServer] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [attachments, setAttachments] = useState([]); // State for multiple file attachments
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const enrollmentNo = localStorage.getItem('enrollmentNo');

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/all-users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  const handleUserSelect = (userEmail) => {
    if (selectedUsers.includes(userEmail)) {
      setSelectedUsers(selectedUsers.filter((email) => email !== userEmail));
    } else {
      setSelectedUsers([...selectedUsers, userEmail]);
    }
  };

  const handleAttachmentChange = (e) => {
    setAttachments(prevFiles => [
      ...prevFiles,
      ...Array.from(e.target.files)
    ]); // Handle multiple file inputs
  };

  const handleRemoveFile = (fileName) => {
    setAttachments(prevFiles =>
      prevFiles.filter(file => file.name !== fileName)
    ); // Remove specific file
  };

  const handleSendEmail = async () => {
    if (selectedUsers.length > 0 && subject.trim() !== '' && body.trim() !== '') {
      const formData = new FormData();
      formData.append('sender_email', senderEmail);
      formData.append('sender_password', senderPassword);
      formData.append('smtp_server', smtpServer);
      formData.append('smtp_port', smtpPort);
      formData.append('recipient_email', JSON.stringify(selectedUsers)); // Convert array to string
      formData.append('subject', subject);
      formData.append('message', body);

      // Append all files with unique keys
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file); // Append multiple files
      });

      try {
        const response = await axios.post('http://127.0.0.1:8000/email/send/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });

        if (response.status === 200) {
          alert('Email sent successfully');
          setAttachments([]); // Clear attachments after sending
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
      }
    } else {
      alert('Please select at least one user and fill out the subject and body.');
    }
  };

  return isAuthenticated ? (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-4xl font-extrabold mb-8 text-green-900">Select Users to Send Email</h1>

      <div className="w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="Sender Email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />
      </div>

      <div className="w-full max-w-4xl mb-4">
        <input
          type="password"
          placeholder="Sender Password"
          value={senderPassword}
          onChange={(e) => setSenderPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />
      </div>

      <div className="w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />
      </div>

      <div className="w-full max-w-4xl mb-4">
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />
      </div>

      <div className="w-full max-w-4xl mb-4">
        <input
          type="file"
          onChange={handleAttachmentChange} // Handle multiple file selections
          multiple // Allow multiple file uploads
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {attachments.length > 0 && (
          <div className="mt-2 text-green-700">
            <strong>Attached Files:</strong>
            <ul>
              {attachments.map((file) => (
                <li key={file.name} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={user.enrollmentNo}
              className="form-checkbox h-5 w-5 text-green-600"
              checked={selectedUsers.includes(user.email)}
              onChange={() => handleUserSelect(user.email)}
            />
            <label htmlFor={user.enrollmentNo} className="text-lg text-gray-900">
              {user.email}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSendEmail}
        className="mt-8 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Send Email
      </button>
    </div>
  ) : null;
}

export default SendEmailPage;
