
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import { useState, useEffect } from 'react';
import WelcomePage from './components/welcome';
import './stylesheets/home.css';
function Home(loggedIn) {
    const [input, setInput] = useState("");
    const searchTab = (input) => {
      setInput(input);
    }
    const navigate = useNavigate();
    //console.log(loggedIn);
    useEffect(() => {
      if (loggedIn.loggedIn == true) {
        //console.log(loggedIn);
        //console.log("app");
        navigate('/app');
      }
    }, [loggedIn, navigate]);
    return (
        <>
          <Header searchTab={searchTab} />
          <WelcomePage/>
        </>
        
    )
}

export default Home;
