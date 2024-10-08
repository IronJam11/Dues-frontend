import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLoginWithChannelI = async () => {
      try {
        // This initiates the OAuth process
        const response = await axios.get("http://127.0.0.1:8000/users/auth/oauth/");
        console.log("OAuth request initiated", response);
        
        // After initiating the OAuth, Channeli will redirect to your callback URL
        // Ensure that the callback is handled on the backend

        // Once redirected back, extract tokens from the URL (as an example below)
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access-token');
        const refreshToken = params.get('refresh-token');

        if (accessToken && refreshToken) {
          // Set tokens as cookies
          document.cookie = `access-token=${accessToken}; path=/;`;
          document.cookie = `refresh-token=${refreshToken}; path=/;`;

          // Redirect to the homepage
          navigate('/homepage');
        } else {
          console.error("Tokens are missing");
        }
      } catch (error) {
        console.error("Error during Channeli OAuth login", error);
      }
    };

    // Call the login function when the page loads
    handleLoginWithChannelI();
  }, [navigate]);

  return <div>Loading... Please wait</div>;
};

export default LoadingPage;
