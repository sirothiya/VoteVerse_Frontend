import React from "react";
import "./Button.css";

export function Button({ children, className = "", onClick, type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
}
