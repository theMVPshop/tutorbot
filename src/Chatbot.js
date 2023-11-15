import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import DevLogo from "../src/assets/DevLogo.png";
import { formatLog, responseAPI } from "./api";

const ChatBot = () => {
  const [log, setLog] = useState([]);
  const [userInput, setUserInput] = useState("");

  const [messages, setMessages] = useState([]);

  const [assistantReply, setAssistantReply] = useState("");

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const logEndRef = useRef(null);
  const autoScroll = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const expandInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // const handleSendMessage = () => {
  //   responseAPI(userInput, setLog)

  //   setMessages([
  //     ...messages,
  //     userInput,
  //     formatLog(log),
  //   ]);

  //   // Clear the user input field
  //   setUserInput("")
  // };

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
        {/* <div className="chatbox__cont ">
          {messages.map((message, index) => (
            <div key={index} className="chatbox">
              {message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div> */}
        {/* <div className="chatbox__cont">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${
                message.role === "user" ? "user" : "chatbot"
              }`}
            >
              <div
                className={`logo ${
                  message.role === "user" ? "user__logo" : "chatbot__logo"
                }`}
              ></div>

              <div className="chatbox">{message.content}</div>
            </div>
          ))}
        </div> */}
        <div className="chatbox__cont">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${
                message.role === "user" ? "user" : "chatbot"
              }`}
            >
              {message.role === "user" ? (
                <>
                  <div className={`logo user__logo`}></div>
                  <div className="chatbox">{message.content}</div>
                </>
              ) : (
                <>
                  <div className={`logo chatbot__logo`}></div>
                  <div className="chatbox">{message.content}</div>
                </>
              )}
            </div>
          ))}
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
