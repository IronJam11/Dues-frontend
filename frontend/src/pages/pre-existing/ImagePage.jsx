import { useState } from 'react';
import axios from 'axios';

const ProfileUpdate = () => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));  // Show image preview
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('profile_image', file);

    try {
      const response = await axios.post('http://backend-url/api/profile-update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="profile-update-form">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="p-2 border rounded"
          placeholder="Enter your name"
        />

        <label className="block text-sm font-medium">Profile Image</label>
        <input type="file" onChange={handleFileChange} className="p-2" />

        {preview && <img src={preview} alt="Preview" className="h-20 w-20 mt-2 rounded-full" />}

        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
