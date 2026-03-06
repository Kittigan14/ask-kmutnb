import React, { useRef, useEffect } from "react";
import logo from "../assets/images/logo_kmutnb.png";
import { formatKMUTNBMessage } from "../utils/TextFormatter";

export default function ChatWindow({ messages, isTyping, onSelectQuestion }) {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <div className="window liquid-glass" id="chatWindow" ref={chatWindowRef}>
      {isEmpty && (
        <div className="chat-placeholder">
          <div className="placeholder-icon">
            <img src={logo} alt="KMUTNB Logo" className="placeholder-logo" />
          </div>

          <h1 className="placeholder-title">
            <span className="title-main">ASK KMUTNB</span>
            <span className="title-sub">ผู้ช่วยตอบคำถาม มจพ.</span>
          </h1>

          <p style={{ marginTop: "0.2rem", fontWeight: 500 }}>
            แชทบอทผู้ช่วยตอบทุกคำถามเกี่ยวกับมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
          </p>
          
        </div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message ${msg.sender === "user" ? "chat-user" : "chat-ai"
            } fade-in`}
        >
          {msg.sender === "user" ? (
            <span>{msg.text}</span>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: formatKMUTNBMessage(msg.text),
              }}
            />
          )}
        </div>
      ))}

      {isTyping && (
        <div className="message chat-ai typing-indicator fade-in">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      )}
    </div>
  );
}
