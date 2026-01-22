import React, { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

export default function ModeSwitcher({ onModeChange }) {
  const [currentMode, setCurrentMode] = useState(API_CONFIG.getCurrentMode());
  const [isAnimating, setIsAnimating] = useState(false);

  const handleModeSwitch = () => {
    setIsAnimating(true);
    
    const newMode = currentMode === 'admission' ? 'campus' : 'admission';
    
    API_CONFIG.setCurrentMode(newMode);
    setCurrentMode(newMode);
    
    if (onModeChange) {
      onModeChange(newMode);
    }
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getModeInfo = (mode) => API_CONFIG.MODES[mode];
  const currentModeInfo = getModeInfo(currentMode);

  return (
    <div className="mode-switcher-container">
      <div className={`mode-switcher ${isAnimating ? 'animating' : ''}`}>
        <button 
          className="mode-toggle-btn" 
          onClick={handleModeSwitch}
          title="คลิกเพื่อสลับโหมด"
        >
          <div className="mode-icon" style={{ color: currentModeInfo.color }}>
            <i className={`fas ${currentModeInfo.icon}`}></i>
          </div>
          
          <div className="mode-text">
            <span className="mode-name">{currentModeInfo.name}</span>
            <span className="mode-desc">{currentModeInfo.description}</span>
          </div>
          
          <i className="fas fa-repeat switch-icon"></i>
        </button>
      </div>
    </div>
  );
}