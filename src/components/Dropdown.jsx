import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import "./dropdown.css";

const Dropdown = ({ items }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null); // reference to the menu container

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
    
      <button className="hamburger" onClick={() => setOpen(!open)}>
        <FaBars size={22} />
      </button>

     
      {open && (
        <div className="dropdown">
            {items.map((item,index)=>{
                return <div key={index} onClick={() => {setOpen(false); item.onClick();}}>{item.label}</div>
            })}
         
        </div>
      )}
    </div>
  );
};

export default Dropdown;


