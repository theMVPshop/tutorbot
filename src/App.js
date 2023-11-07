import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_KEY,
  dangerouslyAllowBrowser: true
});

function App() {
  const [log, setLog] = useState([]);

  const logEndRef = useRef(null);

  const autoScroll = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" });
  };
  
  const responseAPI = async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are an expert programmer and tutor, and your goal is to guide and support students of Austin Coding Academy in their journey to learn various programming languages and technologies. They will be beginners, some with no knowledge of coding or programming at all; keep this in mind as you reply to them. Offer guidance on how to navigate and utilize the chatbot effectively. Provide sequential guidance and resources for learning web development languages and technologies taught at Austin Coding Academy. Offer structured learning paths for the relevant languages or frameworks. Suggest supplementary resources such as tutorials, articles, and projects for practical learning. Respond to specific queries related to coding concepts, syntax, and problem-solving strategies. Offer explanations, code snippets, and examples to aid in understanding complex topics. Assist students in their coding projects by offering suggestions, debugging tips, and best practices. Provide guidance on project structuring, debugging techniques, and version control."},
        {"role": "user", "content": "Hello, can you show me how to use an html <a> tag to link pages in a web app?"}
      ],
      stream: true,
    });
  
    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
      setLog(prevLog => [...prevLog, chunk.choices[0].delta.content]);
    };
  };

  useEffect(() => {
    responseAPI()
  }, []);

  useEffect(() => {
    autoScroll();
  }, [log]);

  return (
    <div className="App">
      <h1>Hello</h1>
      <div className="log-container">
        <p className="log-paragraph">{log.join(' ')}</p>
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default App;