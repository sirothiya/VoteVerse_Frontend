import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import LogoComponent from "../LogoComponent";
import Dropdown from "../Dropdown";

const Navbar = ({ setPage}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const handleDeleteAccount=async()=>{
    try{
        const response= await fetch("https://voteverse-backend-new.onrender.com/user/deleteOne",{
          method:"DELETE",
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        if(!response.ok){
          return alert("Error in Deleting Account");
        }
        alert("Account Deleted Successfully");
        localStorage.clear();
        navigate("/");
    }catch(err){
     console.log("Error in deleting account",err);
     alert("Error in Deleting Account");
    }
  }
  return (
    <nav className="navbar_admin">
      <LogoComponent/>
      <ul className="nav-links">
        <Dropdown items={[
          { label: "Dashboard", onClick: () => setPage("dashboard") },
          { label: "View Results", onClick: () => setPage("result") },
          { label: "Logout", onClick: handleLogout },
          { label: "Delete Account", onClick: handleDeleteAccount}
        ]}/>
      </ul>
    </nav>
  );
};


export default Navbar;
