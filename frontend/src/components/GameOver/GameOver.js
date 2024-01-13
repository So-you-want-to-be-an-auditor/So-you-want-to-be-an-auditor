import './GameOver.css'
import Lottie from 'react-lottie'
import animationData from './sadMan.json'
import { Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import {  useNavigate } from "react-router-dom"
import mouse from "../../sound/mouse.mp3"
import transition from '../Typing/transition'
 function GameOver() {

    const navigate = useNavigate();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
        
      };
    
    const audio = new Audio(mouse);

    const [displayButton, setDisplayButton] = useState(false)
    
    useEffect(() => {
        setTimeout(() => {
            setDisplayButton(true)
        }, 4000)
    }, [])

    return(
        <div className="PageBackground">
            <Typography className='text-rotate-game' variant="h1" style={{fontFamily:"bigGameCustom"}}>
                Game over.
            </Typography>
            {displayButton && <Button onClick ={()=>{
                navigate("/"); 
                audio.play();}}
                variant='contained' sx={{margin: '10px', 
                boxShadow: '4px 4px 4px grey',
                backgroundColor:'#f6da74',
                border: '2px solid black',
                color:'black',
                '&:hover': {background: '#600000', color:'white'},
                width:'30%',
                fontFamily:'smallTypewriter',
                height:'7%', fontSize:'120%'}}>
                Try Again?
            </Button>}
            <div className="sadlifedude" style={{width:'30vw', height:'70vh'}}>
                <Lottie options={defaultOptions}  style={{ height: '500px', width: '300px' }}/>
            </div>
            
            
        </div>
    )
}

export default transition(GameOver);