import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const CookieExample = () => {
  useEffect(async () => {
    // Set a cookie
    Cookies.set('myCookie', 'hehehehehe', { expires: 7 }); // Expires in 7 days

    // Get a cookie
    const cookieValue = Cookies.get('myCookie');
    console.log('Cookie value:', cookieValue);
    const response = await axios.post('http://127.0.0.1:8000/users/login/', {
        'email' : "aaryanjain888@gmail.com",
        'password': "jain",
      }, {
        withCredentials: true, // Send credentials with the request
      });
      console.log(response.data);
      const jwt = response.data.jwt;
      Cookies.set('jwtToken', jwt, { expires: 7 });
      console.log("cookie",Cookies.get('jwtToken'));

      
  }, []);
  

  return (
    <div>
      <h1>Cookie Example</h1>
      <p>Check the console for cookie operations.</p>
    </div>
  );
};

export default CookieExample;
