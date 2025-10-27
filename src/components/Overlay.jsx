import React from "react";

export default function Overlay({ visible, onClick }) {
  if (!visible) return null;
  return <div className="overlay" onClick={onClick}></div>;
}
