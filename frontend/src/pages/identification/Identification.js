import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useNavigate } from "react-router-dom";

import "../../index.css";
import "../../components/Welcome/BeginPage.css";
import transition from "../../components/Typing/transition";
import mouse from "../../sound/mouse.mp3"

const correctAnswers = {
  firstname: "Mona",
  lastname: "Lisa",
  "mailing-address": "1479 Mona Lisa Street",
  city: "London",
  prov: "Ontario",
  sin: "900700500",
  birth: "15 Jun/Juin 1479",
};

const Identification = () => {
  const [questions, setQuestions] = useState([
    { id: "firstname", text: "First Name", answer: "", isCorrect: true },
    { id: "lastname", text: "Last Name", answer: "", isCorrect: true },
    {
      id: "mailing-address",
      text: "Mailing Address",
      answer: "",
      isCorrect: true,
    },
    { id: "city", text: "City", answer: "", isCorrect: true },
    { id: "prov", text: "Prov./Terr.", answer: "", isCorrect: true },
    {
      id: "sin",
      text: "Social Insurance Number",
      answer: "",
      isCorrect: true,
    },
    {
      id: "birth",
      text: "Date of Birth (Year Month Day)",
      answer: "",
      isCorrect: true,
    },
  ]);

  const [answers] = useState([
    { id: "answer-1", content: "Lisa" },
    { id: "answer-2", content: "Mona" },
    { id: "answer-3", content: "Italian/Italienne" },
    { id: "answer-4", content: "15 Jun/Juin 1479" },
    { id: "answer-5", content: "Florence ITA" },
    { id: "answer-6", content: "1479 Mona Lisa Street" },
    { id: "answer-7", content: "London" },
    { id: "answer-8", content: "Ontario" },
    { id: "answer-9", content: "900700500" },
    { id: "answer-10", content: "Mona, Lisa" },
  ]);

  const [showCorrectAnswers, setShowCorrectAnswers] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [popperContent, setPopperContent] = useState("");

  const [currentLives, setCurrentLives] = useState(2);

  const navigate = useNavigate();

  const handleClick = (event, correctAnswer) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setPopperContent(correctAnswer);
    setOpenPopper((prev) => !prev);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destId = result.destination.droppableId;
    const newQuestions = questions.map((question) => {
      if (question.id === destId) {
        return { ...question, answer: answers[sourceIndex].content };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  useEffect(() => {
    if (currentLives === 0) {
      navigate("/gameover");
    }
  }, [currentLives])

  const handleSubmit = () => {
    audio.play();
    const updatedQuestions = questions.map((question) => ({
      ...question,
      isCorrect: question.answer === correctAnswers[question.id],
    }));
    setQuestions(updatedQuestions);

    // Update showcorrectedAns
    const newShowCorrectAnswers = {};
    let allCorrect = true;
    updatedQuestions.forEach((question) => {
      if (!question.isCorrect) {
        newShowCorrectAnswers[question.id] = false; // by default not showing answers
        allCorrect = false;
      }
    });
    setShowCorrectAnswers(newShowCorrectAnswers);

    
    if (allCorrect && currentLives > 0) {
      navigate("/level2");
    } else if (!allCorrect && currentLives > 0) {
      setCurrentLives((prevLives) => prevLives - 1);
    }
  };

  const handleShowCorrectAnswer = (questionId) => {
    setShowCorrectAnswers((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  const HeartIcon = () => {
    return <FavoriteIcon fontSize="large" color="error" />;
  };

  const audio = new Audio(mouse);

  return (
    <div className="PageBackground overflow-y-auto">
      <p className="level-title bordered-text text-7xl pt-12 pb-4 text-center">
        Level One - Identification
      </p>
      <div className="flex justify-center items-center gap-x-12">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="bg-[#fcfdf7] text-black b-8 pb-8 w-1/3 h-[70vh] rounded-2xl custom-shadow">
            <div className="bg-[#f6da74] rounded-t-2xl w-full p-4 form-font text-lg ">
              Step 1 - Identification and Other Information
            </div>
            <div className="flex flex-wrap px-4 m-8 text-lg">
              {" "}
              {questions.map((question, index) => (
                <Droppable key={question.id} droppableId={question.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 min-w-[50%]"
                    >
                      <h3 className="text-black form-font text-md">
                        {question.text}
                      </h3>
                      <div
                        style={{ display: "flex", alignItems: "center" }}
                        className="my-6"
                      >
                        <div style={{ flexGrow: 1 }} className="text-black">
                          <div
                            style={{
                              flexGrow: 1,
                              marginRight: 8,
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              backgroundColor: "#fff",
                              display: "flex",
                              height: 50,
                              alignItems: "center",
                              width: 200
                              // position: "fixed",

                            }}
                            className="text-black form-font text-sm"
                          >
                            {question.answer || "                "}
                          </div>
                        </div>
                        {!question.isCorrect && question.answer && (
                          <div
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => handleShowCorrectAnswer(question.id)}
                          >
                            ⚠️
                          </div>
                        )}
                        {showCorrectAnswers[question.id] && (
                          <div className="text-green-500" text-sm mx-2>
                            Correct Answer: {correctAnswers[question.id]}
                          </div>
                        )}
                        {/* <Popper open={openPopper} anchorEl={anchorEl}>
                          <div
                            style={{
                              border: "1px solid #eee",
                              padding: 10,
                              backgroundColor: "white",
                              borderRadius: 4,
                            }}
                          >
                            {popperContent}
                          </div>
                        </Popper> */}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
          <div className="w-4"></div>

          <div class="flex flex-col items-center py-8 ">
            {/* Answer container */}
            <div className="bg-[#fcfdf7] text-white b-8  rounded-2xl custom-shadow">
              <div className="bg-[#f6da74] rounded-t-2xl text-lg w-full p-4 form-font">
                Basic Information
              </div>
              <div className="flex justify-start items-start mt-4 mb-8 mx-8 text-lg">
                {" "}
                {/* Flex box */}
                <img
                  src="mona-lisa.jpg"
                  alt="mona lisa"
                  style={{
                    width: "100px",
                    height: "150px",
                    borderRadius: "50%",
                    margin: "30px",
                  }}
                />
                <div>
                  <Droppable droppableId="answers" direction="vertical">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <div className="px-2">
                          <p className="text-black form-font text-sm">
                            {" "}
                            Surname
                          </p>
                          <Draggable
                            key={answers[0].id}
                            draggableId={answers[0].id}
                            index={0}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[0].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>

                        <div className="px-2">
                          <p className="text-black form-font text-sm">
                            {" "}
                            Given Names
                          </p>
                          <Draggable
                            key={answers[1].id}
                            draggableId={answers[1].id}
                            index={1}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[1].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>

                        <div className="px-2">
                          <p className="text-blac form-font text-sm">
                            {" "}
                            Date of Birth
                          </p>
                          <Draggable
                            key={answers[3].id}
                            draggableId={answers[3].id}
                            index={3}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[3].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>

                        <div className="px-2 ">
                          <p className="text-black form-font text-sm">
                            {" "}
                            Place of Birth
                          </p>
                          <Draggable
                            key={answers[4].id}
                            draggableId={answers[4].id}
                            index={4}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[4].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>
                        <div className="px-2 w-full">
                          <p className="text-black form-font text-sm">
                            {" "}
                            Where You Live
                          </p>
                          <Draggable
                            key={answers[5].id}
                            draggableId={answers[5].id}
                            index={5}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[5].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>
                        <div className="px-2">
                          <p className="text-black form-font text-sm"> City</p>
                          <Draggable
                            key={answers[6].id}
                            draggableId={answers[6].id}
                            index={6}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[6].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>
                        <div className="px-2">
                          <p className="text-black form-font text-sm">
                            {" "}
                            Province
                          </p>
                          <Draggable
                            key={answers[7].id}
                            draggableId={answers[7].id}
                            index={7}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 8,
                                  margin: "0 0 4px 0",
                                  backgroundColor: "white",
                                  border: "1px solid lightgray",
                                  ...provided.draggableProps.style,
                                  zIndex: 1000,
                                  textAlign: "left",
                                }}
                                className="text-black form-font text-sm"
                              >
                                {answers[7].content}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}{" "}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>

            {/* SIN Info  */}
            <div className="bg-[#fcfdf7] text-white mt-12 w-full rounded-2xl custom-shadow">
              <div className="bg-[#f6da74] rounded-t-2xl text-lg w-full p-4 form-font text-md">
                Social Insurance Number
              </div>
              <Droppable
                droppableId="social-insurance-number"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div className="m-4">
                      {answers.slice(8, 10).map((answer, index) => (
                        <Draggable
                          key={answer.id}
                          draggableId={answer.id}
                          index={index + 8}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 8,
                                margin: "4px 4px 16px 0",
                                backgroundColor: "white",
                                border: "1px solid lightgray",
                                ...provided.draggableProps.style,
                                zIndex: 1000,
                              }}
                              className="text-black form-font text-sm"
                            >
                              {answer.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
      </div>

      <div className="flex justify-end w-full">
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
            style={{ backgroundColor: "#f6da74", color: "black" }}
            size="large"
          >
            <p className="form-font text-sm"> Submit</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default transition(Identification);