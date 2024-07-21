import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './home';
import App from './App';
import Login from "./pages/login"
import Register from "./pages/register"
import Profile from './pages/profile';

function Root() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingLoginStatus, setCheckingLoginStatus] = useState(true);
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await axios.get('http://localhost:8000/username', { withCredentials: true });
        //console.log(response.data.loggedIn);
        setLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.log(error);
      } finally {
        setCheckingLoginStatus(false);
      }
    }
    checkLoginStatus();
    
  }, []);
  //console.log(loggedIn);
  if (checkingLoginStatus) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={loggedIn ? "/app" : "/home"} />} />
        <Route path="/home" element={<Home loggedIn={loggedIn}/>} />
        <Route path="/app" element={<App loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(<Root />);