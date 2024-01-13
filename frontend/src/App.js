import "./App.css";
import TypingEffect from "./components/Typing/TypingEffect";
import { AnimatePresence } from "framer-motion";
// import { Routes, Route, useLocation } from 'react-router-dom';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route, 
  Routes, useLocation
} from "react-router-dom";// Corrected import statement
import Button from './components/Typing/Button';
import Story from './components/Story/Story';
import Dragging from './components/Typing/Dragging';
import BeginPage from './components/Welcome/BeginPage';
import { FaVolumeUp, FaVolumeMute  } from "react-icons/fa";
import Sweet from "./sound/Sweet.mp3";
import {useState, useEffect} from "react";
import Identification from './pages/identification/Identification'
import ChatBox from "./components/Chatbox/Chatbox";
function App() {
        const firstMessage ="Hello, I'm a Tax Advisor, how can I help you today?";

        const [messages, setMessages] = useState([firstMessage]);
        const [inputText, setInputText] = useState('');
        const [loading, setLoading] = useState(false); // Track loading state
        const [show, setShow] = useState(false);
        useEffect(() =>console.log(show), [show])
      
        const handleChat =(e)=>{
          e.preventDefault();
          setShow(show =>!show);
          console.log(show)
      
        }

        const location = useLocation();
        const [play, setPlay] = useState(false);

        useEffect(() => {
          const audio = new Audio(Sweet);
      
          if (play) {
            audio.play();
            audio.loop = true;
          } else {
            audio.pause();
            audio.currentTime = 0;
          }
      
          // Cleanup when the component is unmounted
          return () => {
            audio.pause();
            audio.currentTime = 0;
          };
        }, [play]);
  return (
    <div className="App">
      <div className="main-audio" onClick={()=>setPlay((play)=>!play)}>{play ? <FaVolumeUp /> : <FaVolumeMute />} </div>
      {
            show ? <div className="chatbox">
              <ChatBox 
                messages={messages} 
                setMessages={setMessages}
                loading={loading}
                setLoading={setLoading}
                inputText={inputText}
                setInputText={setInputText} 
                setShow={setShow}/></div>:(
              <div className="ai-img-container" onClick={handleChat}>
                <img className="ai-img" src="https://play-lh.googleusercontent.com/Oe0NgYQ63TGGEr7ViA2fGA-yAB7w2zhMofDBR3opTGVvsCFibD8pecWUjHBF_VnVKNdJ=w240-h480-rw" alt="AI-chatbox" />

              </div>

            )
          }

      <AnimatePresence mode='wait'>
        
      <Routes location={location} key={location.pathname} >
          <Route index element= {<BeginPage />} />
          <Route path="/story" element= { <Story />} />
          <Route path="/level1" element= { <Identification />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
