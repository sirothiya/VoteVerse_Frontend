import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "../CssPages/HomePage.css";
import LogoComponent from "../../components/LogoComponent";
import HelpPanel from "../../components/HelpPanel";

const HomePage = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const handleChatBot = () => {
    setShowChat(!showChat);
  }
  return (
    <div className="hero-page">
      <div className="navbar">
        <LogoComponent />
        <div className="auth-buttons">
          <span className="login" onClick={() => navigate("/login")}>
            Login
          </span>
          <button className="register" onClick={() => navigate("/signup")}>
            Signup
          </button>
        </div>
      </div>
      <div className="hero-main">
        <div className="hero-content">
          <h1>
            Vote Smart, <br />
            Vote Fast, <br />
            Vote Securely!
          </h1>
          <button className="chatbot-btn" onClick={handleChatBot}>
        ℹ️
      </button>
      {showChat && <HelpPanel onClose={()=>setShowChat(false)} />}
        </div>
        <div className="box">
          <img src="../assets/voteImage.png" alt="Vote Illustration"></img>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
