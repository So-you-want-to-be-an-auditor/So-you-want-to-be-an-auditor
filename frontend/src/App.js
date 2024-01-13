import './App.css';
import TypingEffect from './components/Typing/TypingEffect';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom'; // Corrected import statement

function App() {
  return (
    <div className="App">
      <AnimatePresence mode='wait'>
        <TypingEffect />
      </AnimatePresence>
    </div>
  );
}

export default App;
