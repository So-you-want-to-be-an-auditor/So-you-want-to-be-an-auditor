import React, { useState } from 'react';
import './Chatbox.scss';
import axios from 'axios';
import { AiOutlineSend } from "react-icons/ai";
import { BsArrowDownRight, BsXLg } from "react-icons/bs";


const ChatBox = ({messages, setMessages, inputText, setInputText, loading, setLoading, setShow}) => {
  const handleInputChange = event => {
    setInputText(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (inputText.trim() !== '') {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: inputText, isUser: true },
      ]);

      try {
        setLoading(true); // Start loading
        const response = await axios.post(
          'http://127.0.0.1:8000/v1/query',
          {
            query: inputText,
            time_stamp: "1705166849"
          }
        );

        const aiResponse = response.data.answer;
        setMessages(prevMessages => [
          ...prevMessages,
          { text: aiResponse, isUser: false },
        ]);
        setInputText(''); // Clear the input after sending
      } catch (error) {
        console.error('An error occurred:', error);
      }
      finally{
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-nav">
        <div onClick={(e)=>{
          e.preventDefault();
          setShow(false);

        }}><BsArrowDownRight className="icon"/></div>
        <div
          onClick={(e)=>{
            e.preventDefault();
            setShow(false);
            setMessages([])
          }}
        ><BsXLg className="icon"/></div> 
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user' : 'ai'}`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="message ai loading-indicator">
            <span className="bounce b1">●</span>
            <span className="bounce b2">●</span>
            <span className="bounce b3">●</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your question..."
          className="input-field"
        />
        <button type="submit" className="send-button">
          <AiOutlineSend />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;