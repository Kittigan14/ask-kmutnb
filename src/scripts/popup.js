import { 
  createNewSession, 
  canCreateNewSession,
  getSessionLimit,
  getAllSessions,
  deleteSession,
  setCurrentSessionId,
  getCurrentSessionId,
  loadChatHistory
} from './session.js';

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    menu.classList.toggle("show");
    menuOverlay.classList.toggle("active");
}

function closeMenu() {
    const menu = document.getElementById("mobileMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    menu.classList.remove("show");
    menuOverlay.classList.remove("active");
}

function openHistoryPopup(event) {
    event.preventDefault();
    const popup = document.getElementById("historyPopup");
    const overlay = document.getElementById("overlay");
    popup.classList.add("active");
    overlay.classList.add("active");
    closeMenu();
}

function closeHistoryPopup() {
    const popup = document.getElementById("historyPopup");
    const overlay = document.getElementById("overlay");
    popup.classList.remove("active");
    overlay.classList.remove("active");
}

function openRightPanel(event) {
    event.preventDefault();
    const popup = document.getElementById("rightPanel");
    const overlay = document.getElementById("overlay");
    popup.classList.add("active");
    overlay.classList.add("active");
    closeMenu();
}

function closeRightPanel() {
    const popup = document.getElementById("rightPanel");
    const overlay = document.getElementById("overlay");
    popup.classList.remove("active");
    overlay.classList.remove("active");
}

function openContactPopup(event) {
    event.preventDefault();
    const contactPopup = document.getElementById('contactPopup');
    const overlay = document.getElementById('overlay');

    contactPopup.classList.add('active');
    overlay.classList.add('active');
    closeMenu();
}

function closeContactPopup() {
    const contactPopup = document.getElementById('contactPopup');
    const overlay = document.getElementById('overlay');

    contactPopup.classList.remove('active');
    overlay.classList.remove('active');
}

function closeAllPopups() {
    closeHistoryPopup();
    closeRightPanel();
    closeContactPopup();
}

const textarea = document.getElementById("userInput");
if (textarea) {
    textarea.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeAllPopups();
        closeMenu();
    }
});

export function updateSessionCounter() {
  const limit = getSessionLimit();
  const counterElement = document.getElementById('sessionCounter');
  
  if (counterElement) {
    counterElement.innerHTML = `
      <div class="session-counter-text">
        <i class="fas fa-comments"></i>
        <span>แชททั้งหมด</span>
        ${limit.isFull ? '<span class="session-warning"><i class="fas fa-exclamation-circle"></i>เต็ม</span>' : ''}
      </div>
      <div class="session-counter-badge">${limit.current}/${limit.max}</div>
    `;
    
    if (limit.isFull) {
      counterElement.classList.add('full');
    } else {
      counterElement.classList.remove('full');
    }
  }
}

export function renderSessionList(onSessionChange) {
  const sessions = getAllSessions();
  const sessionList = document.getElementById('sessionList');
  const currentSid = getCurrentSessionId();
  
  if (!sessionList) return;
  
  updateSessionCounter();
  
  if (sessions.length === 0) {
    sessionList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <span>ยังไม่มีแชท</span>
      </div>
    `;
    return;
  }
  
  sessionList.innerHTML = sessions.map(session => {
    const isCurrentSession = session.id === currentSid;
    const date = new Date(session.lastUpdate);
    const timeStr = formatTimeAgo(date);
    
    return `
      <li class="session-item ${isCurrentSession ? 'current-session' : ''}" 
          data-session-id="${session.id}">
        <div class="session-preview">
          <div class="session-text">${escapeHtml(session.preview)}</div>
          <div class="session-meta">
            <span class="session-count">
              <i class="fas fa-message"></i>
              ${session.messageCount} ข้อความ
            </span>
            <span class="session-time">
              <i class="fas fa-clock"></i>
              ${timeStr}
            </span>
          </div>
        </div>
        <button class="delete-session-btn" 
                data-session-id="${session.id}"
                title="ลบแชทนี้">
          <i class="fas fa-trash"></i>
        </button>
      </li>
    `;
  }).join('');
  
  attachSessionListeners(onSessionChange);
}

function attachSessionListeners(onSessionChange) {
  document.querySelectorAll('.session-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.delete-session-btn')) {
        const sessionId = item.dataset.sessionId;
        switchToSession(sessionId, onSessionChange);
      }
    });
  });
  
  document.querySelectorAll('.delete-session-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sessionId = btn.dataset.sessionId;
      showDeleteConfirmation(sessionId, onSessionChange);
    });
  });
}

export function switchToSession(sessionId, onSessionChange) {
  setCurrentSessionId(sessionId);
  
  const messages = loadChatHistory(sessionId);
  
  if (onSessionChange) {
    onSessionChange(messages);
  }
  
  renderSessionList(onSessionChange);
  
  showNotification('เปลี่ยนแชทสำเร็จ', 'success');
}

export function handleNewChatButton(onNewChat) {
  const newChatBtn = document.getElementById('newChatBtn');
  
  if (newChatBtn) {
    const canCreate = canCreateNewSession();
    newChatBtn.disabled = !canCreate;
    
    if (!canCreate) {
      newChatBtn.title = 'ถึงขีดจำกัดแชทแล้ว (3/3)';
    } else {
      newChatBtn.title = 'สร้างแชทใหม่';
    }
    
    const newBtn = newChatBtn.cloneNode(true);
    newChatBtn.parentNode.replaceChild(newBtn, newChatBtn);
    
    newBtn.onclick = () => {
      if (!canCreateNewSession()) {
        showSessionLimitPopup(() => {
          openHistoryPopup(new Event('click'));
        });
        return;
      }
      
      const newSessionId = createNewSession();
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        
        if (onNewChat) {
          onNewChat([]);
        }
        
        renderSessionList(onNewChat);
        updateSessionCounter();
        
        showNotification('สร้างแชทใหม่สำเร็จ', 'success');
      }
    };
  }
}

export function showSessionLimitPopup(onConfirm) {
  const popup = document.createElement('div');
  popup.className = 'session-limit-popup';
  popup.innerHTML = `
    <div class="session-limit-content">
      <div class="session-limit-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>ถึงขีดจำกัดแชทแล้ว</h3>
      <p>คุณสามารถมีแชทได้สูงสุด 3 แชทเท่านั้น</p>
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
}

export function showDeleteConfirmation(sessionId, onSessionChange) {
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  dialog.innerHTML = `
    <div class="confirm-content">
      <p>คุณต้องการลบแชทนี้หรือไม่?</p>
      <div class="confirm-buttons">
        <button class="btn-confirm" id="confirmDeleteBtn">
          <i class="fas fa-trash"></i> ลบ
        </button>
        <button class="btn-cancel" id="cancelDeleteBtn">
          <i class="fas fa-times"></i> ยกเลิก
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  document.getElementById('confirmDeleteBtn').onclick = () => {
    if (deleteSession(sessionId)) {
      renderSessionList(onSessionChange);
      updateSessionCounter();
      handleNewChatButton(onSessionChange);
      showNotification('ลบแชทสำเร็จ', 'success');
    } else {
      showNotification('ไม่สามารถลบแชทได้', 'error');
    }
    document.body.removeChild(dialog);
  };
  
  document.getElementById('cancelDeleteBtn').onclick = () => {
    document.body.removeChild(dialog);
  };
  
  dialog.onclick = (e) => {
    if (e.target === dialog) {
      document.body.removeChild(dialog);
    }
  };
}

function formatTimeAgo(date) {
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
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    z-index: 10001;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

export function initSessionManagement(onSessionChange, onNewChat) {
  updateSessionCounter();
  handleNewChatButton(onNewChat);
  
  setInterval(() => {
    handleNewChatButton(onNewChat);
  }, 1000);
}