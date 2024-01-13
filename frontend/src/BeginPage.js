import { Typography, Modal, Button, Box } from "@mui/material"
import { useState } from "react"
import './BeginPage.css'
import TaxForm from './taxForm.svg'

//'So', 'you', 'want', 'to', 'be '
//So you want to be

export default function BeginPage(){

    const titleArr = ['So', 'you', 'want', 'to', 'be ']
    const titleArrTwo = ['an', 'auditor...']

    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <div className="PageBackground">
            <div style={{display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center'}}>
                {titleArr.map((title, index) => (
                    <div key={index} style={{ marginRight:'5%' }} className="text-rotate">
                        <Typography  variant='h1' style={{fontFamily:'bigGameCustom',
                        textShadow: '4px 4px 0px #600000', 
                        color:'#dc0000'}}>
                            {title} 
                        </Typography>
                        
                    </div>
                ))}
            </div>

            <div style={{display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center'}}>
                {titleArrTwo.map((title, index) => (
                    <div key={index} style={{ marginRight: '5%' }} className="text-rotate-two">
                        <Typography variant='h1' style={{fontFamily:'bigGameCustom',
                        textShadow: '4px 4px 0px #600000', 
                        color:'#dc0000'}}>
                            {title} 
                        </Typography>
                    </div>
                ))}
            </div>

            <Button variant='contained' sx={{margin: '10px', 
            boxShadow: '4px 4px 4px grey',
            backgroundColor:'#f6da74',
            border: '2px solid black',
            color:'black',
            '&:hover': {background: '#600000', color:'white'},
            width:'40%',
            fontFamily:'smallTypewriter',
            height:'7%', fontSize:'120%'}}>
                Start
            </Button>
            <Button variant='contained' onClick={openModal} sx={{margin: '10px', 
            backgroundColor:'#f6da74',
            border: '2px solid black',
            color:'black',
            '&:hover': {background: '#600000', color:'white'},
            width:'40%',
            fontFamily:'smallTypewriter',
            height:'7%', fontSize:'120%'}}>
                How To Play
            </Button>
            <img src={TaxForm} alt='Tax Form' width="200" height="200" style={{ 
                position:'absolute',
                top:'10%', 
                left: '10%'}}
                className="tax-effect"/>
            <img src={TaxForm} alt='Tax Form' width="150" height="150" style={{ 
                position:'absolute',
                top:'60%', 
                left: '80%'}}
                className="tax-effect"/>
            
            <Modal open={isOpen} sx={{display: 'flex', 
            alignItems:'center', 
            justifyContent:'center'}}>
                <Box sx={{backgroundColor:'white', height: '80%', width:'75%', 
                border:'4px solid black',
                display: 'flex', justifyContent:'center',
                flexDirection:'column', 
                alignItems:'center'}}>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'150%', 
                    marginTop:'1%'}}>
                        Instructions:
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'1%',
                    marginX:'2%'}}>
                        1. Press start. From here you will enter the game story where you discover that you are a tax auditor. After all it is tax season...
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'2%',
                    marginX:'2%'}}>
                        2. Once you are in the game, drag and drop the items on the right to the correct tax form field on the left.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'2%',
                    marginX:'2%'}}>
                        3. If you are stuck, fear not! Auditor buddy will be in the bottom left corner of this game. You can ask them any question you would like if you are confused.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'2%',
                    marginX:'2%'}}>
                        4. As a tax auditor however, you must make sure to drag the correct items to the correct fields. Otherwise you lose a life! If you lose all 2 lives given to you at each level the game is over :{'('}
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'2%',
                    marginX:'2%'}}>
                        5. Once you are sure of your answers, press submit. If your answers are all correct, you can move onto the next level!! If you complete all the levels without losing all your lives, YOU WIN THE GAME!!
                    </Typography>
                    <Button onClick={closeModal} variant='contained' sx={{margin: '10px', 
                    boxShadow: '4px 4px 4px grey',
                    backgroundColor:'#f6da74',
                    border: '2px solid black',
                    color:'black',
                    '&:hover': {background: '#600000', color:'white'},
                    width:'40%',
                    fontFamily:'smallTypewriter',
                    height:'7%', fontSize:'120%'}}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>

    )
}