import React, { useState, useEffect } from "react";

export default function InfoPanel({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // เพิ่ม delay เล็กน้อยเพื่อให้ animation ทำงาน
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  return (
    <div className={`history-popup ${isVisible ? 'active' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        <i className="fa-solid fa-times"></i>
      </button>
      
      <h3>
        <i className="fa-solid fa-circle-info"></i> ชี้แจงระบบ
      </h3>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        lineHeight: '1.6', 
        color: '#2c2c2c',
        fontSize: '0.95rem'
      }}>
        ระบบ ASK KMUTNB คือแชทบอทอัจฉริยะที่ช่วยตอบคำถามเกี่ยวกับการสมัครเรียน คณะ และชีวิตในมหาวิทยาลัย
      </p>
      
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        margin: 0 
      }}>
        <li style={{ 
          padding: '14px 16px',
          marginBottom: '8px',
          borderRadius: '16px',
          background: 'rgba(211, 117, 107, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#2c2c2c'
        }}>
          <i className="fa-solid fa-link" style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(211, 117, 107, 0.1)',
            borderRadius: '10px',
            color: '#D3756B',
            flexShrink: 0
          }}></i>
          <span>ถามได้เกี่ยวกับคุณสมบัติผู้สมัคร</span>
        </li>
        
        <li style={{ 
          padding: '14px 16px',
          marginBottom: '8px',
          borderRadius: '16px',
          background: 'rgba(211, 117, 107, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#2c2c2c'
        }}>
          <i className="fa-solid fa-link" style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(211, 117, 107, 0.1)',
            borderRadius: '10px',
            color: '#D3756B',
            flexShrink: 0
          }}></i>
          <span>ข้อมูลทุนการศึกษาและค่าใช้จ่าย</span>
        </li>
        
        <li style={{ 
          padding: '14px 16px',
          marginBottom: '8px',
          borderRadius: '16px',
          background: 'rgba(211, 117, 107, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#2c2c2c'
        }}>
          <i className="fa-solid fa-link" style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(211, 117, 107, 0.1)',
            borderRadius: '10px',
            color: '#D3756B',
            flexShrink: 0
          }}></i>
          <span>ข้อมูลหอพักและสิ่งอำนวยความสะดวก</span>
        </li>
        
        <li style={{ 
          padding: '14px 16px',
          marginBottom: '8px',
          borderRadius: '16px',
          background: 'rgba(211, 117, 107, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#2c2c2c'
        }}>
          <i className="fa-solid fa-link" style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(211, 117, 107, 0.1)',
            borderRadius: '10px',
            color: '#D3756B',
            flexShrink: 0
          }}></i>
          <span>วิธีสมัครสอบและกำหนดการรับสมัคร</span>
        </li>
        
        <li style={{ 
          padding: '14px 16px',
          marginBottom: '8px',
          borderRadius: '16px',
          background: 'rgba(211, 117, 107, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#2c2c2c'
        }}>
          <i className="fa-solid fa-link" style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(211, 117, 107, 0.1)',
            borderRadius: '10px',
            color: '#D3756B',
            flexShrink: 0
          }}></i>
          <span>ข้อมูลเกี่ยวกับคณะ</span>
        </li>
      </ul>
    </div>
  );
}