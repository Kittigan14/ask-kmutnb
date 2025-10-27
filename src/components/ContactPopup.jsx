import React, { useState, useEffect } from "react";

export default function ContactPopup({ onClose }) {
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
        <i className="fa-solid fa-headphones"></i> ติดต่อเจ้าหน้าที่
      </h3>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        lineHeight: '1.6', 
        color: '#2c2c2c',
        fontSize: '0.95rem'
      }}>
        หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้ตามช่องทางด้านล่าง
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
          <i className="fa-solid fa-phone" style={{
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
          <span>โทรศัพท์: 02-555-2000</span>
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
          <i className="fa-solid fa-envelope" style={{
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
          <span>อีเมล: admission@kmutnb.ac.th</span>
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
          <i className="fa-brands fa-line" style={{
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
          <span>LINE: @kmutnb_official</span>
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
          <i className="fa-brands fa-facebook" style={{
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
          <span>Facebook: KMUTNB Official</span>
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
          <i className="fa-solid fa-globe" style={{
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
          <span>เว็บไซต์: www.kmutnb.ac.th</span>
        </li>
        
        <li style={{ 
          padding: '14px 16px',
          borderRadius: '16px',
          background: 'rgba(211, 117, 107, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#2c2c2c'
        }}>
          <i className="fa-solid fa-clock" style={{
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
          <span>เวลาทำการ: จันทร์-ศุกร์ 08:30-16:30 น.</span>
        </li>
      </ul>
    </div>
  );
}