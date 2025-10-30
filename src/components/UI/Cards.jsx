import React from "react";
import "./Card.css"; // import the CSS file

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}
