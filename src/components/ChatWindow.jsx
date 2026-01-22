import React, { useRef, useEffect } from "react";
import logo from "../assets/images/logo_kmutnb.png";
import { formatKMUTNBMessage } from "../utils/TextFormatter";
import { API_CONFIG } from "../config/api";

export default function ChatWindow({ messages, isTyping }) {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const currentMode = API_CONFIG.getCurrentMode();

  const getPlaceholderContent = () => {
    if (currentMode === "admission") {
      return {
        title: {
          main: "ASK KMUTNB",
          sub: "การรับสมัคร",
        },
        description: "แชทบอทผู้ช่วยตอบทุกคำถามเกี่ยวกับการเข้าศึกษาที่ มจพ.",
        examples:
          "📝 การเตรียมตัวสอบ | 🧪 ข้อมูลการสอบเข้า | 🎤 การสอบสัมภาษณ์ | 📚 คณะที่เปิดสอน<br />รวมถึงรายละเอียดทุนเรียนดี และคุณสมบัติผู้สมัคร",
      };
    } else {
      return {
        title: {
          main: "ASK KMUTNB",
          sub: "ชีวิตในมหาวิทยาลัย",
        },
        description: "แชทบอทผู้ช่วยตอบทุกคำถามเกี่ยวกับชีวิตในรั้วมหาวิทยาลัย",
        examples:
          "🏢 หอพักและที่พัก | 🍽️ โรงอาหารและร้านค้า | 🚌 การเดินทาง | 🏋️ สิ่งอำนวยความสะดวก<br />รวมถึงกิจกรรม ชมรม และชีวิตนิสิต",
      };
    }
  };

  const placeholder = getPlaceholderContent();

  return (
    <div className="window liquid-glass" id="chatWindow" ref={chatWindowRef}>
      {messages.length === 0 && !isTyping && (
        <div className="chat-placeholder">
          <div className="placeholder-icon">
            <img src={logo} alt="KMUTNB Logo" className="placeholder-logo" />
          </div>

          <h1 className="placeholder-title">
            <span className="title-main">{placeholder.title.main}</span>
            <span className="title-sub">{placeholder.title.sub}</span>
          </h1>

          <p style={{ marginTop: "0.2rem", fontWeight: 500 }}>
            {placeholder.description}
          </p>

          <p
            style={{ marginTop: "1rem", fontWeight: 400 }}
            dangerouslySetInnerHTML={{
              __html: `<b>สอบถามได้ทุกเรื่อง เช่น</b><br />${placeholder.examples}`,
            }}
          />

          <p style={{ marginTop: "1.5rem", fontStyle: "italic", opacity: 0.8 }}>
            เริ่มต้นพิมพ์คำถามของคุณได้เลย...
          </p>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message ${
            msg.sender === "user" ? "chat-user" : "chat-ai"
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
