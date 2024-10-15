import axios from 'axios';
import Cookies from 'js-cookie'
export const fetchUserDetails = async (setUser) => {
  try {
    const token = Cookies.get('accessToken');  // Read the token from cookies
    console.log("Fetching user data...");
    const response = await axios.get('http://127.0.0.1:8000/users/user-data/', {
      headers: {
        'Authorization': `Bearer ${token}`  // Send token as a header
      },
      withCredentials: true,  // Keep this if you're still sending CSRF or session cookies
    });
    console.log("User details:",response.data)

    setUser(response.data);
    console.log("User data from the top: ", response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};
