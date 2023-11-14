import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import DevLogo from "../src/assets/DevLogo.png";
import { formatLog, responseAPI } from "./api";

const ChatBot = () => {
  const [log, setLog] = useState([]);
  const [userInput, setUserInput] = useState("");
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const [messages, setMessages] = useState([]);

  const logEndRef = useRef(null);

  const autoScroll = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const expandInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSendMessage = () => {
    responseAPI(userInput, setLog)

    setMessages([
      ...messages,
      userInput,
      formatLog(log),
    ]);

    // Clear the user input field
    setUserInput("")
  };

  useEffect(() => {
    autoScroll();
  }, [log]);

  return (
    <div className="chatbot__main">
      <div className="app__header">
        <div className="app__header_logo">
          <img src={DevLogo} alt="Devmentor logo" />
          <span>DevMentor</span>
        </div>
      </div>
      <div className="section__padding">
        <div className="chatbox__cont ">
          {messages.map((message, index) => (
            <div key={index} className="chatbox">
              {message}
            </div>
          ))}
          {/* {formatLog(log)} */}
          <div ref={logEndRef} />
        </div>
        <div className="user__input">
          <textarea
            value={userInput}
            onChange={handleUserInput}
            onInput={expandInput}
            placeholder="Type a message..."
            rows="1"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;