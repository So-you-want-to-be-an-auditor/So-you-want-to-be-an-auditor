import './GameWon.css'
import Lottie from 'react-lottie'
import { Typography } from '@mui/material'
import animationData from './confetti.json'
import taxDude from './bank-svgrepo-com.svg'



export default function GameWon(){

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
        
      };


    return (
    <div className="PageBackground" >
        <Typography variant='h1' className="text-zoom" style={{fontFamily:'bigGameCustom', marginBottom:'5%'}}>
            Congratulations!!
        </Typography>
        <Typography variant='h5' style={{fontFamily:'smallTypewriter'}}>
            For now.. Stay tuned for more levels coming soon!!
        </Typography>
            
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Lottie options={defaultOptions}  style={{ height: '400px', width: '600px' }}/>
        </div>
        <img src={taxDude} alt='Tax Form' width="200" height="200" style={{ 
                position:'absolute',
                top:'5%', 
                left: '5%'}}
                className="tax-dude"/>
        <img src={taxDude} alt='Tax Form' width="200" height="200" style={{ 
                position:'absolute',
                top:'60%', 
                left: '80%'}}
                className="tax-dude"/>
    </div>
    )
}