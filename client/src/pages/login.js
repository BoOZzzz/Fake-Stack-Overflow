import React, { useState } from 'react';
import '../stylesheets/login.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({setLoggedIn}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/login', {email: username, password: password});
        const data = response.data;
        if (response.status === 200) {
          // Perform any necessary actions, such as storing the session ID or redirecting to a new page
          document.cookie = `sessionId=${data.sessionId}; path=/`;
          navigate('/app');
          setLoggedIn(true);
        } 
      } catch (error) {
        console.log('Error:', error);
        alert(error.response.data.error);
      }

  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;