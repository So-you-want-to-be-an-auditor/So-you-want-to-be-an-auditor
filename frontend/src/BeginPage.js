import { Typography, Modal, Button, Box } from "@mui/material"
import './BeginPage.css'
import TaxForm from './taxForm.svg'


export default function BeginPage(){

    return (
        <div className="PageBackground">
            
            <Typography variant="h2" sx={{margin: '20px'}}>
                So You Want To Be An Auditor?
            </Typography>

            <Button variant='contained' sx={{margin: '10px', 
            backgroundColor:'#f6da74',
            border: '2px solid black',
            color:'black',
            '&:hover': {background: '#E88B4C'},
            width:'40%'}}>
                Start
            </Button>
            <Button variant='contained' sx={{margin: '10px', 
            backgroundColor:'#f6da74',
            border: '2px solid black',
            color:'black',
            '&:hover': {background: '#E88B4C'},
            width:'40%'}}>
                How To Play
            </Button>
            <img src={TaxForm} width="150" height="150" style={{ 
                position:'absolute',
                top:'10%', 
                left: '10%'}}
                className="tax-effect"/>
            <img src={TaxForm} width="150" height="150" style={{ 
                position:'absolute',
                top:'60%', 
                left: '80%'}}
                className="tax-effect"/>
        </div>

    )
}