import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import HistoryPopup from "./components/HistoryPopup";
import InfoPanel from "./components/InfoPanel";
import ContactPopup from "./components/ContactPopup";
import ModeSwitcher from "./components/ModeSwitcher";
import Overlay from "./components/Overlay";
import { getCurrentSessionId, loadChatHistory } from "./scripts/session";
import { initSessionManagement, handleNewChatButton } from "./scripts/popup";
import "./styles/style.css";
import "./styles/session.css";
import "./styles/messageFormatting.css";
import "./styles/modeSwitcher.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  const [activePopup, setActivePopup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState('admission');

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

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    console.log("Mode changed to:", newMode);
    
    const modeNames = {
      admission: 'การรับสมัคร',
      campus: 'ชีวิตในมหาวิทยาลัย'
    };
    
    const container = document.querySelector('.container');
    if (container) {
      container.classList.add('mode-changing');
      setTimeout(() => {
        container.classList.remove('mode-changing');
      }, 600);
    }
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
        onModeChange={handleModeChange}
      />

        {/* Mode Switcher - Mobile only */}
        {/* <div className="mobile-only">
          <ModeSwitcher onModeChange={handleModeChange} />
        </div> */}
      <section className="chat-window">
        
        <ChatWindow messages={messages} isTyping={isTyping} currentMode={currentMode} />
        <ChatInput 
          messages={messages} 
          setMessages={setMessages} 
          setIsTyping={setIsTyping} 
        />
      </section>

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

      <Overlay 
        visible={!!activePopup || menuOpen} 
        onClick={closeAllPopups} 
      />
    </div>
  );
}