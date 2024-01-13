import './App.css';
import TypingEffect from './components/Typing/TypingEffect';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom'; // Corrected import statement
import Button from './components/Typing/Button';
import Story from './components/Story/Story';
import Dragging from './components/Typing/Dragging';
function App() {
  return (
    <div className="App">
      <AnimatePresence mode='wait'>
        {/* <TypingEffect />
        <Button /> */}
        <Story />
        {/* <Dragging /> */}
      </AnimatePresence>
    </div>
  );
}

export default App;




