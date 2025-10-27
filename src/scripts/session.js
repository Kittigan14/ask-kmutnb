let currentSessionId = sessionStorage.getItem('currentSessionId') || null;

const MAX_SESSIONS = 3;

export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

export const createNewSession = () => {
  const sessions = getAllSessions();
  if (sessions.length >= MAX_SESSIONS) {
    return null;
  }
  
  const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  currentSessionId = newSessionId;
  sessionStorage.setItem('currentSessionId', newSessionId);
  
  sessionStorage.setItem(`chat_history_${newSessionId}`, JSON.stringify([]));
  
  return newSessionId;
};

export const canCreateNewSession = () => {
  const sessions = getAllSessions();
  return sessions.length < MAX_SESSIONS;
};

export const getSessionLimit = () => {
  return {
    current: getAllSessions().length,
    max: MAX_SESSIONS,
    remaining: MAX_SESSIONS - getAllSessions().length,
    isFull: getAllSessions().length >= MAX_SESSIONS
  };
};

export const getCurrentSessionId = () => {
  if (!currentSessionId) {
    currentSessionId = createNewSession();
  }
  return currentSessionId;
};

export const setCurrentSessionId = (sessionId) => {
  currentSessionId = sessionId;
  sessionStorage.setItem('currentSessionId', sessionId);
};

export const saveChatHistory = (messages, sessionId = null) => {
  try {
    const sid = sessionId || getCurrentSessionId();
    sessionStorage.setItem(`chat_history_${sid}`, JSON.stringify(messages));
  } catch (error) {
    console.error('ไม่สามารถบันทึกประวัติแชท:', error);
  }
};

export const loadChatHistory = (sessionId = null) => {
  try {
    const sid = sessionId || getCurrentSessionId();
    const history = sessionStorage.getItem(`chat_history_${sid}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('ไม่สามารถโหลดประวัติแชท:', error);
    return [];
  }
};

export const addMessageToSession = (text, sender) => {
  const history = loadChatHistory();
  const newMessage = { 
    text, 
    sender, 
    timestamp: new Date().toISOString() 
  };
  const newHistory = [...history, newMessage];
  saveChatHistory(newHistory);
  return newHistory;
};

export const getAllSessions = () => {
  try {
    const sessions = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('chat_history_')) {
        const sessionId = key.replace('chat_history_', '');
        const messages = loadChatHistory(sessionId);
        
        if (messages.length > 0) {
          const firstMessage = messages[0];
          const lastMessage = messages[messages.length - 1];
          
          sessions.push({
            id: sessionId,
            preview: firstMessage.text.substring(0, 50) + (firstMessage.text.length > 50 ? '...' : ''),
            messageCount: messages.length,
            lastUpdate: lastMessage.timestamp || new Date().toISOString(),
            messages
          });
        }
      }
    }
    
    return sessions.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
  } catch (error) {
    console.error('ไม่สามารถโหลดรายการ session:', error);
    return [];
  }
};

export const deleteSession = (sessionId) => {
  try {
    sessionStorage.removeItem(`chat_history_${sessionId}`);
    
    if (sessionId === currentSessionId) {
      createNewSession();
    }
    
    return true;
  } catch (error) {
    console.error('ไม่สามารถลบ session:', error);
    return false;
  }
};

export const clearAllSessions = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('chat_history_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    createNewSession();
    
    return true;
  } catch (error) {
    console.error('ไม่สามารถล้างทั้งหมด:', error);
    return false;
  }
};

export const showSessionLimitPopup = (onConfirm) => {
  const popup = document.createElement('div');
  popup.className = 'session-limit-popup';
  popup.innerHTML = `
    <div class="session-limit-content">
      <div class="session-limit-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>ถึงขีดจำกัดแชทแล้ว</h3>
      <p>คุณสามารถมีแชทได้สูงสุด ${MAX_SESSIONS} แชทเท่านั้น</p>
      <p class="session-limit-hint">กรุณาลบแชทเก่าก่อนสร้างแชทใหม่</p>
      <div class="session-limit-buttons">
        <button class="btn-manage" id="manageSessionsBtn">
          <i class="fas fa-list"></i>
          จัดการแชท
        </button>
        <button class="btn-close-popup" id="closePopupBtn">
          <i class="fas fa-times"></i>
          ปิด
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  document.getElementById('manageSessionsBtn').onclick = () => {
    document.body.removeChild(popup);
    if (onConfirm) onConfirm();
  };
  
  document.getElementById('closePopupBtn').onclick = () => {
    document.body.removeChild(popup);
  };
  
  popup.onclick = (e) => {
    if (e.target === popup) {
      document.body.removeChild(popup);
    }
  };
};