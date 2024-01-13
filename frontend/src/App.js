import "./App.css";
import TypingEffect from "./components/Typing/TypingEffect";
import { AnimatePresence } from "framer-motion";
// import { Routes, Route, useLocation } from 'react-router-dom';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; // Corrected import statement
import Button from "./components/Typing/Button";
import Story from "./components/Story/Story";
import Dragging from "./components/Typing/Dragging";
import BeginPage from "./components/Welcome/BeginPage";
import Identification from "./pages/identification/Identification";
function App() {
  const location = useLocation();
  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<BeginPage />} />
          <Route path="/story" element={<Story />} />
          <Route path="/identification" element={<Identification />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
