import React, { useState } from 'react';
import { motion } from 'framer-motion';
import "./Button.css"
import mouse from "../../sound/mouse.mp3";
import { useNavigate } from 'react-router';
const Button = () => {
  const [isClicked, setIsClicked] = useState(false);
  const audio = new Audio(mouse);
  const navigate = useNavigate();
  const handleClick = () => {
    setIsClicked(!isClicked);
    audio.play();
    navigate("../level1");
  };

  return (
    <motion.button
      className="custom-button"
      whileHover={{ scale: 1.1, borderColor: '#FF5733' }}
      whileTap={{ scale: 0.9, backgroundColor: '#FF5733', color: 'black' }}
      initial={{ scale: 1 }}
      animate={{ scale: isClicked ? 1.1 : 1 }}
      onClick={handleClick}
    >
      Next
    </motion.button>
  );
};

export default Button;
