import React from "react";
import logo from "../assets/images/logo_kmutnb.png";

export default function Navbar({ toggleMenu, openPopup, menuOpen }) {
  
  const handleMenuClick = (popupName) => (e) => {
    e.preventDefault();
    openPopup(popupName);
  };

  const handleToggleMenu = (e) => {
    e.preventDefault();
    toggleMenu();
  };

  return (
    <div className="navbar liquid-glass">
      <div className="nav-title">
        <img src={logo} width="48" alt="KMUTNB Logo" />
        <span>ASK KMUTNB</span>
      </div>

      <div className="menu-toggle" onClick={handleToggleMenu}>
        <i className="fa-solid fa-bars"></i>
      </div>

      <ul className={`menu-items ${menuOpen ? "active" : ""}`}>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); }}>
            <i className="fa-solid fa-comment"></i>
            <span>แชท</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={handleMenuClick("history")}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span>ประวัติแชท</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={handleMenuClick("info")}>
            <i className="fa-solid fa-circle-info"></i>
            <span>ชี้แจงระบบ</span>
          </a>
        </li>
        <li>
          <a href="#" onClick={handleMenuClick("contact")}>
            <i className="fa-solid fa-headphones"></i>
            <span>ติดต่อเจ้าหน้าที่</span>
          </a>
        </li>
      </ul>
    </div>
  );
}