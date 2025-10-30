import React from "react";
import "../components/ChatBot.css";
import { useState } from "react";

const ChatBot = ({ showChat, setShowChat }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello Shalini! 👋 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to call Gemini API and get response

  const generateChatBotResponse = async () => {
    console.log("Generating response...");
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: input,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ans = data["candidates"][0]["content"]["parts"][0];
      console.log("Response data:", ans.text);
      return ans.text;
    } catch (error) {
      console.error("Error generating response:", error);
      return "Sorry, I couldn't process your request at the moment.";
    }
  };

  const handleSend = async () => {
    try {
      if (!input.trim()) return;
      const newMessage = { id: Date.now(), sender: "user", text: input };
      console.log("User message:", newMessage);
      setMessages([...messages, newMessage]);
      const response = await generateChatBotResponse();
      console.log("ChatBot response:", response);
      // Simulate bot response after a delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: "bot", text: response },
        ]);
      }, 1000);

      setInput("");
      setIsLoading(false);
    } catch (err) {
      console.error("Error in handleSend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-panel ${showChat ? "open" : ""}`}>
      {/* Header */}
      <div className="chat-header">
        <h2>ChatBot</h2>
        <button onClick={() => setShowChat(false)}>✖</button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble ${
              msg.sender === "user" ? "chat-user" : "chat-bot"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <img
        src="../assets/Spinningarrows.gif"
        alt="Loading..."
        className={`loader ${isLoading ? "visible" : "hidden"}`}
      />

      {/* Input */}
      <div className="chat-input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
                e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
