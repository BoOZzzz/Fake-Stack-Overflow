import React, { useState } from 'react';
import '../stylesheets/register.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCPasswordChange = (e) => {
    setCPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
        setErrorMsg('Passwords do not match');
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        setErrorMsg('Invalid email format');
        return;
    }
    try {
        const res = await axios.get(`http://localhost:8000/users`);
        const users = res.data;
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            setErrorMsg('User with this email already exists');
            return;
        }
    } catch (err) {
        console.error(err);
        setErrorMsg('Error checking for preexisting user');
        return;
    }

    if (password.includes(email) || password.includes(username)) {
        setErrorMsg('Password cannot contain email or username');
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ username, email, password });

    try {
        await axios.post('http://localhost:8000/register', body, config);
        alert('registered succesfully!')
        setTimeout(() => {
            navigate('/home');
        }, 3000);
    } catch (err) {
        console.error(err.response.data);
        if (err.response && err.response.data) {
            setErrorMsg(err.response.data.error);
        } else {
            setErrorMsg('Error registering user');
        }
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
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
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
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
      <div>
        <label htmlFor="cpassword">Verify Password:</label>
        <input
          type="password"
          id="cpassword"
          value={cPassword}
          onChange={handleCPasswordChange}
        />
      </div>
      <button type="submit">Register</button>
      {errorMsg && <div className="error">{errorMsg}</div>}
    </form>
  );
};

export default RegisterForm;