import React, { useState } from "react";
import "./PasswordChange.css";
import LogoComponent from "./LogoComponent";
import { useNavigate } from "react-router-dom";

const PasswordChange = () => {
  const [form, setForm] = useState({
    oldpassword: "",
    newpassword: ""
  });

  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      oldpassword: form.oldpassword,
      newpassword: form.newpassword
    };
    console.log("data", data);

    try {
      const response = await fetch(
        "https://voteverse-backend-deploy.onrender.com/user/profile/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        return alert("Error in Changing Password");
      }

      alert("Password Changed successfully");
      navigate("/profile");
    } catch (err) {
      console.error("error in changing password", err);
      alert("Error in Changing Password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="password">
      <LogoComponent />
      <div className="password_card">
        <form onSubmit={handleSubmit} className="login_password">
          <input
            type="password"
            name="oldpassword"
            placeholder="Old Password"
            value={form.oldpassword}
            onChange={handleChange}
            required
            className="input_password"
          />
          <input
            type="password"
            name="newpassword"
            placeholder="New Password"
            value={form.newpassword}
            onChange={handleChange}
            required
            className="input_password"
          />
          <button type="submit" className="btn_password">
            Change Password
          </button>
        </form>  
      </div> 
      <button
            className="action-btn"
            onClick={() => navigate(-1)}
          >
           Back
          </button>
    </div>
  );
};

export default PasswordChange;
