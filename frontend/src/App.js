import './App.css';
import TypingEffect from './components/Typing/TypingEffect';
import { AnimatePresence } from 'framer-motion';
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
function App() {
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

      <AnimatePresence mode='wait'>
        
      <Routes location={location} key={location.pathname} >
          <Route index element= {<BeginPage />} />
          <Route path="/story" element= { <Story />} />
        </Routes>

      </AnimatePresence>
    </div>
  );
}

export default App;




