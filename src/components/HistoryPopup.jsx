import React, { useState, useEffect } from "react";
import { 
  getAllSessions, 
  createNewSession, 
  clearAllSessions, 
  setCurrentSessionId,
  loadChatHistory,
  deleteSession,
  canCreateNewSession,
  getSessionLimit
} from "../scripts/session";

export default function HistoryPopup({ onClose, onSessionChange }) {
  const [sessions, setSessions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sessionLimit, setSessionLimit] = useState({ current: 0, max: 3, isFull: false });

  useEffect(() => {
    loadSessions();
    updateSessionLimit();
    // เพิ่ม delay เล็กน้อยเพื่อให้ animation ทำงาน
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  // เพิ่ม useEffect ใหม่เพื่อ debug
  useEffect(() => {
    console.log('📊 Sessions state updated:', sessions.length);
    console.log('🔒 Clear All disabled?', sessions.length === 0);
  }, [sessions]);

  const loadSessions = () => {
    const allSessions = getAllSessions();
    console.log('🔄 Loading sessions:', allSessions.length); // Debug
    setSessions(allSessions);
  };

  const updateSessionLimit = () => {
    const limit = getSessionLimit();
    setSessionLimit(limit);
  };

  const handleNewChat = () => {
    // ตรวจสอบว่าสามารถสร้างแชทใหม่ได้หรือไม่
    if (!canCreateNewSession()) {
      setShowLimitPopup(true);
      return;
    }

    const newSessionId = createNewSession();
    if (newSessionId) {
      onSessionChange([]);
      loadSessions();
      updateSessionLimit();
      onClose();
    }
  };

  const handleClearAll = () => {
    // console.log('🗑️ Clear All clicked');
    // console.log('📊 Current sessions:', sessions.length);
    // console.log('📊 Actual sessions in storage:', getAllSessions().length);
    
    if (sessions.length === 0) {
      alert('ไม่มีแชทให้ลบ');
      return;
    }
    
    setShowConfirm(true);
  };

  const confirmClearAll = () => {
    clearAllSessions();
    setSessions([]); // อัปเดต state ทันที
    updateSessionLimit();
    onSessionChange([]);
    setShowConfirm(false);
    // ไม่ต้องปิด popup ให้ผู้ใช้เห็นว่าลบหมดแล้ว
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    const history = loadChatHistory(sessionId);
    onSessionChange(history);
    onClose();
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('ต้องการลบการสนทนานี้หรือไม่?')) {
      deleteSession(sessionId);
      loadSessions();
      updateSessionLimit();
      
      const allSessions = getAllSessions();
      if (allSessions.length === 0) {
        onSessionChange([]);
      }
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'เมื่อสักครู่';
      if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
      if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
      if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
      
      return date.toLocaleDateString('th-TH', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return 'ไม่ทราบเวลา';
    }
  };

  return (
    <>
      <div className={`history-popup ${isVisible ? 'active' : ''}`}>
        <button className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-times"></i>
        </button>
        
        <h3>
          <i className="fa-solid fa-clock-rotate-left"></i> ประวัติแชท
        </h3>

        {/* Session Counter - แสดงจำนวนแชท */}
        <div className={`session-counter ${sessionLimit.isFull ? 'full' : ''}`}>
          <div className="session-counter-text">
            <i className="fa-solid fa-comments"></i>
            <span>แชททั้งหมด</span>
            {sessionLimit.isFull && (
              <span className="session-warning">
                <i className="fa-solid fa-exclamation-circle"></i>
                เต็ม
              </span>
            )}
          </div>
          <div className="session-counter-badge">
            {sessionLimit.current}/{sessionLimit.max}
          </div>
        </div>

        <div className="popup-actions">
          <button 
            className="action-btn new-chat-btn" 
            onClick={handleNewChat}
            disabled={sessionLimit.isFull}
            title={sessionLimit.isFull ? 'ถึงขีดจำกัดแชทแล้ว (3/3)' : 'สร้างแชทใหม่'}
          >
            <i className="fa-solid fa-plus"></i> 
            <span>New Chat</span>
          </button>
          {/* <button 
            className="action-btn clear-chat-btn" 
            onClick={handleClearAll}
            disabled={sessionLimit.current === 0}
            title={sessionLimit.current === 0 ? 'ไม่มีแชทให้ลบ' : 'ลบแชททั้งหมด'}
          >
            <i className="fa-solid fa-trash"></i> 
            <span>Clear All</span>
          </button> */}
        </div>

        <ul id="sessionList">
          {sessions.length === 0 ? (
            <li className="empty-state">
              <i className="fa-solid fa-inbox"></i>
              <span>ยังไม่มีประวัติการสนทนา</span>
            </li>
          ) : (
            sessions.map((session) => (
              <li 
                key={session.id} 
                className="session-item"
                onClick={() => handleSelectSession(session.id)}
              >
                <div className="session-content">
                  <div className="session-icon">
                    <i className="fa-solid fa-message"></i>
                  </div>
                  <div className="session-info">
                    <div className="session-preview">{session.preview}</div>
                    <div className="session-meta">
                      <span className="session-count">
                        <i className="fa-solid fa-comment"></i> {session.messageCount}
                      </span>
                      <span className="session-time">{formatDate(session.lastUpdate)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="delete-session-btn"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  title="ลบการสนทนา"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Confirm Clear All Dialog */}
      {showConfirm && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <p>ต้องการลบประวัติการสนทนาทั้งหมดหรือไม่?</p>
            <div className="confirm-buttons">
              <button onClick={confirmClearAll} className="btn-confirm">ยืนยัน</button>
              <button onClick={() => setShowConfirm(false)} className="btn-cancel">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {/* Session Limit Popup */}
      {showLimitPopup && (
        <div className="session-limit-popup">
          <div className="session-limit-content">
            <div className="session-limit-icon">
              <i className="fa-solid fa-exclamation-triangle"></i>
            </div>
            <h3>ถึงขีดจำกัดแชทแล้ว</h3>
            <p>คุณสามารถมีแชทได้สูงสุด {sessionLimit.max} แชทเท่านั้น</p>
            <p className="session-limit-hint">กรุณาลบแชทเก่าก่อนสร้างแชทใหม่</p>
            <div className="session-limit-buttons">
              <button 
                className="btn-close-popup" 
                onClick={() => setShowLimitPopup(false)}
              >
                <i className="fa-solid fa-times"></i>
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}