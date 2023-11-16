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

// expandInput func has changed to reduce the size of chatbox while conversation getting longer
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const MAX_TEXTAREA_HEIGHT = 100; 

  const expandInput = (e) => {
    const newHeight =
      e.target.scrollHeight > MAX_TEXTAREA_HEIGHT
        ? `${MAX_TEXTAREA_HEIGHT}px`
        : "auto";
    setTextareaHeight(newHeight);
    e.target.style.height = newHeight;
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
    const assistantMessage = "This is Hard-coded reply";

    setMessages([
      ...messages,
      userMessage,
      { role: "assistant", content: assistantMessage },
    ]);
    setAssistantReply(assistantMessage);

    // Reset textarea height after sending the message
    const textarea = document.querySelector(".user__input textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }
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

        <div
          className="chatbox__cont"
          style={{ maxHeight: `calc(88vh - ${textareaHeight})` }}
        >
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
            style={{ height: textareaHeight }}
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
