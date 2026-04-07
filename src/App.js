import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import HistoryPopup from "./components/HistoryPopup";

import ContactPopup from "./components/ContactPopup";
import Overlay from "./components/Overlay";
import SuggestedQuestions from "./components/SuggestedQuestions";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import { getCurrentSessionId, loadChatHistory } from "./scripts/session";
import { initSessionManagement, handleNewChatButton } from "./scripts/popup";
import "./styles/style.css";
import "./styles/session.css";
import "./styles/messageFormatting.css";
import "./styles/darkmode.css";
import "./styles/suggestedQuestions.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function ChatApp() {
  const [activePopup, setActivePopup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const handleSelectQuestion = (question) => {
    setPendingQuestion(question);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('darkMode', newVal);
      return newVal;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const sessionId = getCurrentSessionId();
    const history = loadChatHistory();
    setMessages(history);
    console.log("Current session:", sessionId, "Messages:", history.length);

    initSessionManagement(
      (newMessages) => { setMessages(newMessages); },
      (newMessages) => { setMessages(newMessages); }
    );
  }, []);

  useEffect(() => {
    handleNewChatButton((newMessages) => {
      setMessages(newMessages);
    });
  }, [messages]);

  const closeAllPopups = () => {
    setActivePopup(null);
    setMenuOpen(false);
  };

  const openPopup = (popupName) => {
    setActivePopup(popupName);
    setMenuOpen(false);
  };

  const toggleMenu = () => { setMenuOpen(!menuOpen); };

  const handleSessionChange = (newMessages) => {
    setMessages(newMessages);
    closeAllPopups();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeAllPopups();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="container">
      <Navbar
        toggleMenu={toggleMenu}
        openPopup={openPopup}
        menuOpen={menuOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <section className="chat-window">
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onSelectQuestion={handleSelectQuestion}
        />
        <ChatInput
          messages={messages}
          setMessages={setMessages}
          setIsTyping={setIsTyping}
          pendingQuestion={pendingQuestion}
          onPendingQuestionSent={() => setPendingQuestion(null)}
        />
      </section>


      {activePopup === "history" && (
        <HistoryPopup
          onClose={closeAllPopups}
          onSessionChange={handleSessionChange}
        />
      )}

      {activePopup === "suggested" && (
        <div className={`history-popup suggested-popup active`}>
          <button className="close-btn" onClick={closeAllPopups}>
            <i className="fa-solid fa-times"></i>
          </button>
          <h3>
            <i className="fas fa-lightbulb"></i> คำถามแนะนำ
          </h3>
          <SuggestedQuestions onSelectQuestion={(q) => { handleSelectQuestion(q); closeAllPopups(); }} />
        </div>
      )}

      {activePopup === "contact" && (
        <ContactPopup onClose={closeAllPopups} />
      )}

      <Overlay
        visible={!!activePopup || menuOpen}
        onClick={closeAllPopups}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}