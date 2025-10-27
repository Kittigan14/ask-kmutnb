import React from "react";
import logo from "../assets/images/logo_kmutnb.png";

export default function ChatWindow({ messages, isTyping }) {
  return (
    <div className="window liquid-glass" id="chatWindow">
      {messages.length === 0 && !isTyping && (
        <div className="chat-placeholder">
          <img src={logo} alt="Logo" className="logo" />
          <h1>ASK KMUTNB</h1>
          <p style={{ marginTop: "0.2rem", fontWeight: 500 }}>
            แชทบอทผู้ช่วยตอบทุกคำถามเกี่ยวกับการเข้าศึกษาที่ มจพ.
          </p>
          <p style={{ marginTop: "1rem", fontWeight: 400 }}>
            <b>สอบถามได้ทุกเรื่อง เช่น</b><br />
            📝 การเตรียมตัวสอบ | 🧪 ข้อมูลการสอบเข้า | 🎤 การสอบสัมภาษณ์ | 📚 คณะที่เปิดสอน<br />
            รวมถึงรายละเอียดทุนเรียนดี หอพัก และชีวิตในรั้วมหาวิทยาลัย
          </p>
          <p style={{ marginTop: "1.5rem", fontStyle: "italic", opacity: 0.8 }}>
            เริ่มต้นพิมพ์คำถามของคุณได้เลย...
          </p>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.sender === 'user' ? 'chat-user' : 'chat-ai'}`}>
          {msg.text}
        </div>
      ))}

      {isTyping && (
        <div className="message chat-ai typing-indicator">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      )}
    </div>
  );
}
