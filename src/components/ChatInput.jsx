import React, { useState, useRef, useEffect } from "react";
import {
  getCurrentSessionId,
  getUserId,
  addMessageToSession,
} from "../scripts/session";
import {
  sendMessageToWebhook,
  parseWebhookResponse,
  getErrorMessage,
} from "../config/api";

export default function ChatInput({ messages, setMessages, setIsTyping }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

    const newMessages = addMessageToSession(userMessage, "user");
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      const sessionId = getCurrentSessionId();
      const userId = getUserId();

      const data = await sendMessageToWebhook(userMessage, sessionId, userId);

      const aiResponse = parseWebhookResponse(data);

      const updatedMessages = addMessageToSession(aiResponse, "ai");
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = getErrorMessage(error);
      const errorMessages = addMessageToSession(errorMessage, "ai");
      setMessages(errorMessages);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        placeholder="พิมพ์คำถามของคุณ..."
        rows="1"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        style={{ opacity: isLoading || !input.trim() ? 0.5 : 1 }}
        title={isLoading ? "กำลังส่งข้อความ..." : "ส่งข้อความ"}
      >
        <i
          className={
            isLoading
              ? "fa-solid fa-circle-notch fa-spin"
              : "fa-solid fa-paper-plane"
          }
        ></i>
      </button>
    </div>
  );
}
