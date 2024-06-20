import React from 'react';
import App from '../App';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
    
  return (
    <div className="welcome-container">
      <h1 className="welcome-heading">Welcome to Fake Stack Overflow!</h1>
      <p>Please choose one of the following options:</p>
      <div className="button-container">
        <Link to="/login"><button className="login-button">Log in</button></Link>
        <Link to="/register"><button className="register-button">Register</button></Link>
        <Link to="/app"><button className="guest-button">Continue as guest</button></Link>
        
        
      </div>
    </div>
  );
}

export default WelcomePage;