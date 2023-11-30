import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import DevLogo from "../src/assets/DevLogo.png";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import Chat from "./models/Chat";

import "./App.css";
import "./screen.css";

const CHAT_CONFIG = {
  model: "gpt-4",
  purpose:
    "You are an expert programmer and tutor, and your goal is to guide and support students of Austin Coding Academy in their journey to learn various programming languages and technologies. They will be beginners, some with no knowledge of coding or programming at all; keep this in mind as you reply to them. Provide sequential guidance and resources for learning web development languages and technologies taught at Austin Coding Academy. Offer structured learning paths for the relevant languages or frameworks. Suggest supplementary resources such as tutorials, articles, and projects for practical learning. Respond to specific queries related to coding concepts, syntax, and problem-solving strategies. Offer explanations, code snippets, and examples to aid in understanding complex topics. Assist students in their coding projects by offering suggestions, debugging tips, and best practices. Provide guidance on project structuring, debugging techniques, and version control.",
};

const ChatBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [stream, setStream] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const chatEndRef = useRef(null);
  const autoScroll = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

  const handleChange = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else {
      setPrompt(e.target.value);
    }
  };

  const callback = useCallback(
    (chunk) => setStream((currStream) => currStream + chunk),
    []
  );

  const chat = useMemo(() => {
    const newChat = new Chat(CHAT_CONFIG, callback);
    newChat.setApiKey(process.env.REACT_APP_KEY);
    return newChat;
  }, [callback]);

  useEffect(() => {
    if (stream) {
      const updatedHistory = [...chatHistory];
      updatedHistory[updatedHistory.length - 1] = {
        role: "assistant",
        content: stream,
      };
      setChatHistory(updatedHistory);
      console.log(stream);
    }
  }, [stream]);

  const handleSubmit = async () => {
    if (prompt.trim() === "") {
      return; // Don't send empty messages
    }

    setIsLoading(true);
    setChatHistory([
      ...chatHistory,
      { role: "user", content: prompt },
      { role: "", content: "" },
    ]);

    // Reset textarea height after sending the message
    const textarea = document.querySelector(".user__input textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }

    // Clear the user input field
    setPrompt("");
    try {
      await chat.createResponse(prompt);
    } catch (error) {
      console.error(error);
    } finally {
      setStream("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    autoScroll();
  }, [chatHistory]);

  return (
    <div className="chatbot__main">
      <div className="app__header">
        <div className="app__header_logo">
          <img src={DevLogo} alt="Devmentor logo" />
          <span>DevMentor</span>
        </div>
      </div>
      <div className="section__padding">
        <div
          className="chatbox__cont"
          style={{ maxHeight: `calc(88vh - ${textareaHeight})` }}
        >
          {chatHistory.map((message, index) => (
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
                      className="chatbox__assis"
                      children={message.content}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              wrapLongLines
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
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
          <div ref={chatEndRef}></div>
        </div>

        <div className="user__input">
          <textarea
            style={{ height: textareaHeight }}
            value={prompt}
            onChange={handleChange}
            onInput={expandInput}
            placeholder="Type a message..."
            rows="1"
            onKeyDown={handleChange}
          />
          <button disabled={isLoading} onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
