import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import HistoryPopup from "./components/HistoryPopup";
import InfoPanel from "./components/InfoPanel";
import ContactPopup from "./components/ContactPopup";
import Overlay from "./components/Overlay";
import { getCurrentSessionId, loadChatHistory } from "./scripts/session";
import { initSessionManagement, handleNewChatButton } from "./scripts/popup";
import "./styles/style.css";
import "./styles/session.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  const [activePopup, setActivePopup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const sessionId = getCurrentSessionId();
    const history = loadChatHistory();
    setMessages(history);
    console.log("Current session:", sessionId, "Messages:", history.length);

    initSessionManagement(
      (newMessages) => {
        setMessages(newMessages);
      },
      (newMessages) => {
        setMessages(newMessages);
      }
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
    console.log("Opening popup:", popupName);
    setActivePopup(popupName);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSessionChange = (newMessages) => {
    setMessages(newMessages);
    closeAllPopups(); 
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
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
      />

      <section className="chat-window">
        <ChatWindow messages={messages} isTyping={isTyping} />
        <ChatInput 
          messages={messages} 
          setMessages={setMessages} 
          setIsTyping={setIsTyping} 
        />
      </section>

      {/* Render popups conditionally */}
      {activePopup === "history" && (
        <HistoryPopup 
          onClose={closeAllPopups} 
          onSessionChange={handleSessionChange}
        />
      )}
      
      {activePopup === "info" && (
        <InfoPanel onClose={closeAllPopups} />
      )}
      
      {activePopup === "contact" && (
        <ContactPopup onClose={closeAllPopups} />
      )}

      {/* Overlay */}
      <Overlay 
        visible={!!activePopup || menuOpen} 
        onClick={closeAllPopups} 
      />
    </div>
  );
}