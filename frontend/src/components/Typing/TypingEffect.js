import React from 'react'
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import CursorBlinker from "./CursorBlinker";
import transition from './transition';
function TypingEffect() {
    const baseText = "Welcome to So you want to be an Auditor, the thrilling adventure where you embark on a journey to become the ultimate tax auditor and conquer the financial frontier! As a newly recruited tax auditor, your mission is to navigate through the complex world of tax forms, uncover hidden deductions, and ensure that every taxpayer's financial universe is in perfect order.";
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) =>
      baseText.slice(0, latest)
    );
  
    useEffect(() => {
      const controls = animate(count, baseText.length, {
        type: "tween",
        duration: 5,
        ease: "easeInOut",
      });
      return controls.stop;
    });
  
    return (
      <span className="story-content">
        <motion.span>{displayText}</motion.span>
        <CursorBlinker />
      </span>
    );
}

export default transition(TypingEffect);




