import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';

const Dragging = () => {
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
  
  export default Dragging;