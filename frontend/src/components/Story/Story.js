import React from 'react'
import "./Story.css"
import TypingEffect from '../Typing/TypingEffect'
import board from "./board.jpg"
import Button from '../Typing/Button'
function Story() {
  return (
    <div className="Story">
        <h1>Game Story</h1>
        <div className="story-content"> 
            <div className="story-div">
                <TypingEffect />
            </div>
           
        </div>
        <Button />
        
    </div>
  )
}

export default Story