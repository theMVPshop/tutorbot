import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import DevLogo from "../src/assets/DevLogo.png";
// import { formatLog, responseAPI } from "./api";
import OpenAI from 'openai';
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatBot = () => {
  // const [log, setLog] = useState([]);
  const [userInput, setUserInput] = useState("");

  const [messages, setMessages] = useState([]);

  // const [assistantReply, setAssistantReply] = useState("");

  const handleUserInput = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chat(userInput);
    } else {
      setUserInput(e.target.value);
    }
  };

  const logEndRef = useRef(null);
  const autoScroll = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // expandInput func has changed to reduce the size of chatbox when conversation getting longer
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

  // This is updated code for onKeyDown (Enter) to Submit
  // const handleSendMessage = () => {
  //   if (userInput.trim() === "") {
  //     return; // Don't send empty messages
  //   }

  //   const userMessage = { role: "user", content: userInput };
  //   const assistantMessage = "This is a hardcoded reply"; // You can replace this with your actual assistant reply logic

  //   const updatedMessages = [
  //     ...messages,
  //     userMessage,
  //     { role: "assistant", content: assistantMessage },
  //   ];

  //   setMessages(updatedMessages);
  //   setAssistantReply(assistantMessage);

  //   // Reset textarea height after sending the message
  //   const textarea = document.querySelector(".user__input textarea");
  //   if (textarea) {
  //     textarea.style.height = "auto";
  //   }

  //   // Clear the user input field
  //   setUserInput("");
  // };

  //Configure API ***
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_KEY,
    dangerouslyAllowBrowser: true,
  });
  
  //New Function ***
  const chat = async (userInput) => {
    if (userInput.trim() === "") {
      return; // Don't send empty messages
    }

    let msgs = messages;
    msgs.push({ role: "user", content: userInput });
    setMessages(msgs);

    // Reset textarea height after sending the message
    const textarea = document.querySelector(".user__input textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }
    // Clear the user input field
    setUserInput("");

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert programmer and tutor, and your goal is to guide and support students of Austin Coding Academy in their journey to learn various programming languages and technologies. They will be beginners, some with no knowledge of coding or programming at all; keep this in mind as you reply to them. Provide sequential guidance and resources for learning web development languages and technologies taught at Austin Coding Academy. Offer structured learning paths for the relevant languages or frameworks. Suggest supplementary resources such as tutorials, articles, and projects for practical learning. Respond to specific queries related to coding concepts, syntax, and problem-solving strategies. Offer explanations, code snippets, and examples to aid in understanding complex topics. Assist students in their coding projects by offering suggestions, debugging tips, and best practices. Provide guidance on project structuring, debugging techniques, and version control.",
        },
        ...messages,
      ],
      stream: true,
    });

    let newMessages = ''

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
      if (chunk.choices[0].delta.content) {
        newMessages += chunk.choices[0].delta.content;
      }
    }

    setMessages((prevMessages) => [...prevMessages, {role: "assistant", content: newMessages}]);
  };

  useEffect(() => {
    autoScroll();
  }, [messages]);

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
                  <div className="chatbox">
                    <Markdown
                      children={message.content}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              wrapLongLines
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  </div>
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
            onKeyDown={handleUserInput}
          />
          <button onClick={() => chat(userInput)}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;