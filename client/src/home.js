import App from './App';
import Header from './components/header';
import { useState, useEffect } from 'react';
import WelcomePage from './components/welcome';
import './stylesheets/home.css';
function Home() {
    const [input, setInput] = useState("");
    const searchTab = (input) => {
      setInput(input);
    }

    return (
        <>
          <Header searchTab={searchTab} />
          <WelcomePage/>
        </>
        
    )
}

export default Home;
