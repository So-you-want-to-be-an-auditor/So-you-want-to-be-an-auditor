import React, { useState, useEffect } from "react";
import { Box, Modal, Typography } from '@mui/material'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import transition from "../../components/Typing/transition";

import { useNavigate } from "react-router-dom";

import "../../index.css";
import "../../components/Welcome/BeginPage.css";
import mouse from "../../sound/mouse.mp3"

const correctAnswers = {
  field1: 60,
  field2: 20,
  field3: 20,
  field4: 20,
  field5: 120,
};

const Donations = () => {
  const [fields, setFields] = useState({
    field1: {
      value: "",
      error: false,
      helperText: "",
      prompt: "Donations Made to Registered Charities: $",
    },
    field2: {
      value: "",
      error: false,
      helperText: "",
      prompt: "Donations Made to Government Bodies: $",
    },
    field3: {
      value: "",
      error: false,
      helperText: "",
      prompt: "Donations Made to Registered Universities Outside Canada: $",
    },
    field4: {
      value: "",
      error: false,
      helperText: "",
      prompt: "Donation Made to United Nations: $",
    },
    field5: {
      value: "",
      error: false,
      helperText: "",
      prompt: "Total Donations: $",
    },
  });
  const [currentLives, setCurrentLives] = useState(2);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: { ...prevFields[name], value },
    }));
  };

  useEffect(() => {
    if (currentLives === 0) {
      navigate("/gameover");
    }
  }, [currentLives])

  const handleSubmit = () => {
    audio.play();
    let allCorrect = true;
    const newFields = {};
    Object.keys(fields).forEach((name) => {
      const isCorrect = parseInt(fields[name].value) === correctAnswers[name];
      if (!isCorrect) allCorrect = false;
      newFields[name] = {
        ...fields[name],
        error: !isCorrect,
        helperText: isCorrect ? "" : "Incorrect answer",
      };
    });
    setFields(newFields);

    if (allCorrect && currentLives > 0) {
      navigate("/gamewon");
    } else if (!allCorrect && currentLives > 0) {
      setCurrentLives((prevLives) => prevLives - 1);
    }

    
  };

  const HeartIcon = () => {
    return <FavoriteIcon fontSize="large" color="error" />;
  };

  const audio = new Audio(mouse);

  const[isOpen, setIsOpen] = useState(true)

  const openModal = () => {
    setIsOpen(true);
    audio.play();
  }

  const closeModal = () => {
    setIsOpen(false);
    audio.play()
  }

  return (
    <div className="PageBackground overflow-y-auto overflow-x-auto">
      <p className="level2-title bordered-text text-7xl py-4 pb-4">
        Level Two - Charitable Donations
      </p>
      <div className="flex justify-center py-4 items-center gap-x-8">
        <div className="bg-[#fcfdf7] text-black b-8 pb-8 w-1/2 h-[70vh] rounded-2xl custom-shadow overflow-y-auto">
          <div className="bg-[#FB9788] rounded-t-2xl w-full p-4 form-font text-lg ">
            Schedule A - Donations and Gifts
          </div>
          <div className="flex flex-col items-start justify-start gap-8 flex-wrap px-4 m-8 text-lg">
            {Object.entries(fields).map(
              ([name, { value, error, helperText, prompt }]) => (
                <div className="flex justify-center gap-4">
                  <p className="form-font text-sm">{prompt}</p>
                  <TextField
                    key={name}
                    name={name}
                    value={value}
                    error={error}
                    helperText={helperText}
                    onChange={handleInputChange}
                    variant="standard"
                  />
                </div>
              )
            )}
          </div>
        </div>
        <div className="w-4"></div>

        <div className="bg-[#fcfdf7] text-black b-8 pb-8 w-1/3  rounded-2xl custom-shadow overflow-y-auto">
          <div className="bg-[#FB9788] rounded-t-2xl w-full p-4 form-font text-lg ">
            Donations and Gifts List
          </div>
          <div className="flex flex-col items-start justify-start pt-4 px-6 gap-4 flex-wrap">
            <div className="bg-[#cce4a8]  text-sm rounded-2xl w-full p-4 form-font  ">
              Tax Receipt -- London Children Charity{" "}
              <div className="text-end"> Gift Amt: $60</div>
            </div>
            <div className="bg-[#cce4a8] text-sm  rounded-2xl w-full p-4 form-font  ">
              Tax Receipt -- South London Neighbourhood Resource Centre
              <div className="text-end"> Gift Amt: $20</div>
            </div>
            <div className="bg-[#ffc7c2] text-sm  rounded-2xl w-full p-4 form-font  ">
              Tax Receipt -- Harvard Univerity
              <div className="text-end"> Gift Amt: $20</div>
            </div>
            <div className="bg-[#aee1da] text-sm  rounded-2xl w-full p-4 form-font  ">
              Tax Receipt -- United Nations
              <div className="text-end"> Gift Amt: $20</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full py-4 px-4">
        <div>
          {" "}
          <div>
            {currentLives > 0 &&
              [...Array(currentLives)].map((_, index) => (
                <HeartIcon key={index} />
              ))}
          </div>
        </div>

        <div className="px-8">
          {" "}
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: "#FB9788", color: "black", border:'2px solid black' }}
            size="large"
          >
            <p className="form-font text-sm"> Submit</p>
          </Button>
          <Button
            onClick={openModal}
            style={{ backgroundColor: "#FB9788", color: "black", border:'2px solid black'}}
            size="large"
          >
            <p className="form-font text-sm"> Tutorial</p>
          </Button>
        </div>
      </div>
      <Modal open={isOpen} sx={{display: 'flex', 
            alignItems:'center', 
            justifyContent:'center'}}>
      <Box sx={{backgroundColor:'white', height: '90%', width:'75%', 
                border:'4px solid black',
                display: 'flex', justifyContent:'center',
                flexDirection:'column'}}>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'1%', marginX: '2%'}}>
                        The point of this activity is to show you the importance of being able to 
                        correctly fill out the charitable donations section of a tax form. This activity does require a little math (be warned!).
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'120%', 
                    marginTop:'1%',
                    marginX:'2%'}}>
                        People that make charitable donations in Canada are eligible for a federal Charitable Donation Tax Credit (CDTC) which allows donors to
                        reduce their federal income taxes. However in order to be eligible, valid receipts and the correct amount from them must be entered.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'100%', 
                    marginTop:'2%',
                    marginX:'2%'}}>
                        1. You have been given a valid receipt. Your task is to correctly identify and fill out/type in the correct amount for each section. Finally, you must add up the numbers and write the correct total amount on the last line. 
                        If there is no organization given for a specific line, you can assume that the value for that line is 0.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'100%', 
                    marginTop:'1%',
                    marginX:'2%'}}>
                        Line 1 - Donations made to Registered Canadian Charities - A full list can be found on the Canada.ca website.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'100%', 
                    marginTop:'1%',
                    marginX:'2%'}}>
                         Line 2 - Donations made to a Canadian Government body. This includes federal, provincial, and municipal governments within Canada.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'100%', 
                    marginTop:'1%',
                    marginX:'2%'}}>
                        Line 3 - Donations made to registered universities outside Canada - DO NOT include donation amounts for universities within Canada.
                    </Typography>
                    <Typography sx={{fontFamily:'smallTypewriter', 
                    fontSize:'100%', 
                    marginTop:'1%',
                    marginX:'2%'}}>
                        Line 4 - Donations made to the United Nations or registered foreign charities the Government of Canada has made a donation to. - Only inlude foreign charities here, Canadian charities belong in Line 1.
                    </Typography>
                    
                    <Button onClick={closeModal} variant='contained' sx={{margin: '10px', 
                    boxShadow: '4px 4px 4px grey',
                    backgroundColor:'#FB9788',
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
  );
};

export default transition(Donations);
