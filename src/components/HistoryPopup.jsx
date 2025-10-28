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
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const loadSessions = () => {
    const allSessions = getAllSessions();
    console.log('🔄 Loading sessions:', allSessions.length);
    setSessions(allSessions);
  };

  const updateSessionLimit = () => {
    const limit = getSessionLimit();
    setSessionLimit(limit);
  };

  const handleNewChat = () => {
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
    
    if (sessions.length === 0) {
      alert('ไม่มีแชทให้ลบ');
      return;
    }
    
    setShowConfirm(true);
  };

  const confirmClearAll = () => {
    console.log('✅ Confirming clear all...');
    
    const success = clearAllSessions();
    
    if (success) {
      setSessions([]);
      updateSessionLimit();
      onSessionChange([]);
      setShowConfirm(false);
      
      console.log('✅ All sessions cleared successfully');
      
      alert('ลบประวัติการสนทนาทั้งหมดเรียบร้อยแล้ว');
    } else {
      console.error('❌ Failed to clear sessions');
      alert('เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่อีกครั้ง');
    }
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
      const success = deleteSession(sessionId);
      
      if (success) {
        loadSessions();
        updateSessionLimit();
        
        const allSessions = getAllSessions();
        if (allSessions.length === 0) {
          onSessionChange([]);
        }
      } else {
        alert('เกิดข้อผิดพลาดในการลบ');
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

        {/* Session Counter */}
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
          <button 
            className="action-btn clear-chat-btn" 
            onClick={handleClearAll}
            disabled={sessions.length === 0}
            title={sessions.length === 0 ? 'ไม่มีแชทให้ลบ' : 'ลบแชททั้งหมด'}
          >
            <i className="fa-solid fa-trash"></i> 
            <span>Clear All</span>
          </button>
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
        <div className="confirm-dialog" onClick={(e) => {
          if (e.target.className === 'confirm-dialog') {
            setShowConfirm(false);
          }
        }}>
          <div className="confirm-content">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ marginBottom: '1rem', color: '#2c2c2c' }}>ลบประวัติทั้งหมด?</h3>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              คุณแน่ใจหรือไม่ว่าต้องการลบประวัติการสนทนาทั้งหมด ({sessions.length} แชท)?<br/>
              <strong>การกระทำนี้ไม่สามารถย้อนกลับได้</strong>
            </p>
            <div className="confirm-buttons">
              <button onClick={confirmClearAll} className="btn-confirm">
                <i className="fa-solid fa-check"></i> ยืนยันลบ
              </button>
              <button onClick={() => setShowConfirm(false)} className="btn-cancel">
                <i className="fa-solid fa-times"></i> ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Limit Popup */}
      {showLimitPopup && (
        <div className="session-limit-popup" onClick={(e) => {
          if (e.target.className === 'session-limit-popup') {
            setShowLimitPopup(false);
          }
        }}>
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