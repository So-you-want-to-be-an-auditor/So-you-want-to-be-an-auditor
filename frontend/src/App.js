import './App.css';
// import TypingEffect from './components/Typing/TypingEffect';
// import { AnimatePresence } from 'framer-motion';
// import { Routes, Route, useLocation } from 'react-router-dom'; // Corrected import statement
// import Button from './components/Typing/Button';
// function App() {
//   return (
//     <div className="App">
//       <AnimatePresence mode='wait'>
//         <TypingEffect />
//         <Button />
//       </AnimatePresence>
//     </div>
//   );
// }

// export default App;


// import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import { motion, useDragControls } from "framer-motion"
import React, { useRef } from 'react';

// const DraggableComponent = () => {
//   // const x = useMotionValue(0);
//   // const y = useMotionValue(0);

//   return (
//     <motion.div
//       drag
//       dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//       style={{ x, y }}
//     >
//       {/* Your draggable content */}
//       <div>Drag me!</div>
//     </motion.div>
//   );
// };

// const TargetBox = ({ isVisible }) => {
//   return (
//     <motion.div
//       style={{
//         width: '100px',
//         height: '100px',
//         background: 'lightblue',
//         display: isVisible ? 'block' : 'none',
//       }}
//     >
//       {/* Your target box content */}
//       Target Box
//     </motion.div>
//   );
// };


// import React, { useRef } from 'react';
// import { motion, useDragControls } from 'framer-motion';

const App = () => {
  const controls = useDragControls();
  const hiPositionRef = useRef({ x: 0, y: 0 });
  const correctBoundingBox = useRef(null);

  function startDrag(event) {
    controls.start(event);
  }

  function handleDragHi(event, info) {
    hiPositionRef.current = info.point;
  }

  function handleDragEndHi() {
    checkPosition();
  }

  function checkPosition() {
    if (!correctBoundingBox.current) return;

    const hiBoundingBox = {
      x: hiPositionRef.current.x,
      y: hiPositionRef.current.y,
    };
    console.log("hi: ", hiPositionRef.current);
    console.log("box: ", correctBoundingBox.current);
    const isHiInsideCorrect =
      hiBoundingBox.x >= correctBoundingBox.current.x-50 &&
      hiBoundingBox.x <= correctBoundingBox.current.x + 50 &&
      hiBoundingBox.y >= correctBoundingBox.current.y -50 &&
      hiBoundingBox.y <= correctBoundingBox.current.y+50;

    console.log(isHiInsideCorrect);
  }

  return (
    <>
      <div onPointerDown={startDrag} />
      <motion.div
        drag
        dragControls={controls}
        whileTap={{ cursor: 'grabbing' }}
        onDrag={handleDragHi}
        onDragEnd={handleDragEndHi}
        className="hi"
      >
        Hi
      </motion.div>
      <div
        className="correct"
        ref={(el) => (correctBoundingBox.current = el?.getBoundingClientRect())}
      >
        Correct
      </div>
    </>
  );
};

export default App;
