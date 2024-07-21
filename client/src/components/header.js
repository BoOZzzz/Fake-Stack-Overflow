import { handleLogout } from "../pages/logout";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function Header({searchTab, loggedIn, username}) {
    const navigate = useNavigate();
    const [logoutMessage, setLogoutMessage] = useState(null);
    
     const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let input = document.getElementById("input");
            searchTab(input.value);
            
        }
     }

     const handleLogoutClick = async () => {
        try{
            const logoutMessage = await handleLogout();
            setLogoutMessage(logoutMessage);
            setTimeout(() => {
                setLogoutMessage(null);
                navigate('/home');
            }, 3000);
        } catch (error) {
            console.error('Logout failed:', error);
            setLogoutMessage('Logout failed');
        }
     }

    return (
        <div id="header" className="header">
            
            {loggedIn? (
                <div id="userOptions">
                    {logoutMessage ? (
                        <p>{logoutMessage}</p>
                    ) : (
                        <p>Welcome, {username}!</p>
                    )}
                    <button onClick={handleLogoutClick}>Log Out</button>
                    <button style={{marginLeft: '20px'}}>Profile</button>
                </div>
                
            ):(
                <div id="userOptions">
                <button onClick={() => navigate('/home')}>Home</button>
            </div>
            )}
            <div id="title"><h1>Fake Stackoverflow</h1></div>
            <div id="search"><form><input id="input" placeholder="Search..." size="30" 
            onKeyUp={(e)=>handleKeyPress(e)}></input></form></div>
        </div>
    )

    
}


