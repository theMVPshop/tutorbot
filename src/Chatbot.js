import React, { useState } from "react";
import "./App.css";
import DevLogo from "../src/assets/DevLogo.png";

const ChatBot = ({ inputValue }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [assistantReply, setAssistantReply] = useState("");

  const expandInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    const userMessage = { role: "user", content: userInput };
    const assistantMessage = "This is a hard-coded assistant reply."; // Hard-coded reply

    setMessages([
      ...messages,
      userMessage,
      { role: "assistant", content: assistantMessage },
    ]);
    setAssistantReply(assistantMessage);

    // Clear the user input field
    setUserInput("");
  };

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
          {/* <div className="chatbox"> */}
          {messages.map((message, index) => (
            <div key={index} className="chatbox">
              {message.content}
            </div>
          ))}
          {/* </div> */}
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
