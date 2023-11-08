import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
      model: "gpt-4-1106-preview",
      messages: [
        {"role": "system", "content": "You are an expert programmer and tutor, and your goal is to guide and support students of Austin Coding Academy in their journey to learn various programming languages and technologies. They will be beginners, some with no knowledge of coding or programming at all; keep this in mind as you reply to them. Offer guidance on how to navigate and utilize the chatbot effectively. Provide sequential guidance and resources for learning web development languages and technologies taught at Austin Coding Academy. Offer structured learning paths for the relevant languages or frameworks. Suggest supplementary resources such as tutorials, articles, and projects for practical learning. Respond to specific queries related to coding concepts, syntax, and problem-solving strategies. Offer explanations, code snippets, and examples to aid in understanding complex topics. Assist students in their coding projects by offering suggestions, debugging tips, and best practices. Provide guidance on project structuring, debugging techniques, and version control."},
        {"role": "user", "content": "Hello, can you show me how to use an html <a> tag to link pages in a web app?"}
      ],
      stream: true,
    });
  
    let codeBlockContent = '';
    let isCodeBlock = false;
    let awaitingClosingTick = false; // New flag to handle awaiting the last `

    for await (const chunk of completion) {
      const content = chunk.choices[0].delta.content;
      console.log(content);

      if (content !== undefined) {
        // Handle the start of a code block
        if (content.startsWith('```') && !isCodeBlock) {
          isCodeBlock = true;
          continue; // Skip this chunk, it's just the start of a code block
        }

        // Handle the content of a code block
        if (isCodeBlock) {
          codeBlockContent += content;

          // Handle the end of a code block
          if (awaitingClosingTick && content === '`') {
            // This is the final ` completing the code block
            isCodeBlock = false;
            awaitingClosingTick = false;

            // Remove the trailing ```
            const cleanedContent = codeBlockContent.replace(/```$/, '');
            setLog(prevLog => [...prevLog, `CODE_BLOCK_START${cleanedContent}CODE_BLOCK_END`]);
            codeBlockContent = '';
          } else if (content.endsWith('``')) {
            // We've received `` and are now awaiting the final `
            awaitingClosingTick = true;
          }
        } else {
          // Regular text chunk, just add it to the log
          setLog(prevLog => [...prevLog, content]);
        }
      }
    }
  };

  const formatLog = (logEntries) => {
    return logEntries.flatMap((entry, index) => { // Use flatMap to flatten the resulting arrays
      if (entry !== undefined) {
        if (typeof entry === 'string') {
          // Split entry into parts of code and text
          const parts = entry.split(/(CODE_BLOCK_START|CODE_BLOCK_END)/);
  
          return parts.map((part, partIndex) => {
            if (part === 'CODE_BLOCK_START') {
              // Next part is code, so skip rendering this marker
              return null;
            } else if (part === 'CODE_BLOCK_END') {
              // Code has ended, so skip rendering this marker
              return null;
            } else if (parts[partIndex - 1] === 'CODE_BLOCK_START') {
              // This part is code, render with SyntaxHighlighter
              return (
                <SyntaxHighlighter key={`code-${index}-${partIndex}`} language="javascript" style={dark}>
                  {part}
                </SyntaxHighlighter>
              );
            } else {
              // Regular text, render in a span
              return <span key={`text-${index}-${partIndex}`}>{part}</span>;
            }
          }).filter(part => part !== null); // Filter out null entries (the markers)
        }
      }
      return []; // If entry is undefined, return an empty array
    });
  };  

  useEffect(() => {
    autoScroll();
  }, [log]);

  return (
    <div className="App">
      <h1>Hello</h1>
      <div className="log-container">
        {formatLog(log)}
        <div ref={logEndRef} />
      </div>
      <button onClick={responseAPI}>Click Me</button>
    </div>
  );
};

export default App;