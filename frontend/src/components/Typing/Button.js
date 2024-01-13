import React, { useState } from 'react';
import { motion } from 'framer-motion';
import "./Button.css"
const Button = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
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
