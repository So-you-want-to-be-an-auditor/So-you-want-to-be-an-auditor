import './App.css';
import TypingEffect from './components/Typing/TypingEffect';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom'; // Corrected import statement
import Button from './components/Typing/Button';
import Story from './components/Story/Story';
import Dragging from './components/Typing/Dragging';
<<<<<<< Updated upstream
=======
import BeginPage from './components/Welcome/BeginPage';
import { FaVolumeUp, FaVolumeMute  } from "react-icons/fa";
import Sweet from "./sound/Sweet.mp3";
import {useState, useEffect} from "react";
import Identification from './pages/identification/Identification'
import GameOver from "./components/GameOver/GameOver";
>>>>>>> Stashed changes
function App() {
  return (
    <div className="App">
      <AnimatePresence mode='wait'>
<<<<<<< Updated upstream
        {/* <TypingEffect />
        <Button /> */}
        <Story />
        {/* <Dragging /> */}
=======
        
      <Routes location={location} key={location.pathname} >
          <Route index element= {<BeginPage />} />
          <Route path="/story" element= { <Story />} />
          <Route path="/level1" element= { <Identification />} />
          <Route path="/gameover" element= {<GameOver />}/>
        </Routes>
>>>>>>> Stashed changes
      </AnimatePresence>
    </div>
  );

}

export default App;




