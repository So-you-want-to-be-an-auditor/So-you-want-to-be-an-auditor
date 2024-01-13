import React from 'react'
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import CursorBlinker from "./CursorBlinker";
import transition from './transition';
function TypingEffect() {
    const baseText = "heello shehack....., ";
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) =>
      baseText.slice(0, latest)
    );
  
    useEffect(() => {
      const controls = animate(count, baseText.length, {
        type: "tween",
        duration: 1.5,
        ease: "easeInOut",
      });
      return controls.stop;
    }, []);
  
    return (
      <span className="">
        <motion.span>{displayText}</motion.span>
        <CursorBlinker />
      </span>
    );
}

export default transition(TypingEffect);




