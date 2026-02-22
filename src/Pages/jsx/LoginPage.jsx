
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../CssPages/loginPage.css"; 
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const LoginPage = () => {
  const [roleType, setRoleType] = useState("Voter");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ rollNumber: "", password: "" ,email:""});
  const [loading , setLoading]=useState(false);
  const navigate = useNavigate();

  const handleToggle = (type) => {
    setRoleType(type);
    setFormData({ rollNumber: "", password: "" ,email:""});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let endpoint = "";
    if (roleType === "Voter")
      endpoint = "https://voteverse-backend-new.onrender.com/user/userLogin";
    else if (roleType === "Candidate")
      endpoint = "https://voteverse-backend-new.onrender.com/candidate/candidateLogin";
    else endpoint = "https://voteverse-backend-new.onrender.com/admin/adminLogin";

    try {
        setLoading(true);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`${roleType} login successful!`);
        localStorage.setItem("token", data.token);
        console.log("Login Response Data:", data); 

        const roleConfig={
          Admin:{
            role:"admin",
            navigateTo:"/admin",
            log:()=>console.log("AdminData: ",data.Admin)
          },
          Candidate :{
            role:"candidate",
            extra :()=>localStorage.setItem("candidate", JSON.stringify(data.candidate)),
            log:()=>console.log("CandidateData: ",data.candidate),
            navigateTo:`/candidateProfile/${data.candidate?.rollNumber}`,
          },
          Voter :{
            role:"voter",
            log:()=>console.log("UserData: ",data.User),
            navigateTo:`/profile/${data.User?.rollNumber}`,
          }
        }
        const config=roleConfig[roleType]
        if(config){
          localStorage.setItem("role", config.role);
          config.log();
          config.extra?.();
          navigate(config.navigateTo);
        }

      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again!");
    }finally{
     setLoading(false)
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="toggle-section">
          {["Voter", "Candidate", "Admin"].map((role) => (
            <button
              key={role}
              className={`toggle-btn ${roleType === role ? "active" : ""}`}
              onClick={() => handleToggle(role)}
            >
              {role} Login
            </button>
          ))}
        </div>

        <h2 className="form-title">{roleType} Login</h2>
        {loading && <Loader  content="Logging in..."/>}

        <form onSubmit={handleSubmit} className="form-body">
          {roleType === "Admin" ? (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                placeholder="Enter RollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ?<FaEye />  :  <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Login as {roleType}
          </button>


          
            <p className="switch-link">
              Don’t have an account?{" "}
              <a href="/signup" className="link">
                Sign Up
              </a>
            </p>
        </form>

        <button
          className="back-btnss"
          onClick={() => navigate("/")}
          style={{ marginTop: "15px" }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
