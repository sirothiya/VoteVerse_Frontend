

// export default Login;
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../CssPages/loginPage.css"; // ✅ using same theme
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [roleType, setRoleType] = useState("Voter");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ rollNumber: "", password: "" ,email:""});
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
      endpoint = "https://voteverse-backend-deploy.onrender.com/user/userLogin";
    else if (roleType === "Candidate")
      endpoint = "https://voteverse-backend-deploy.onrender.com/candidate/candidateLogin";
    else endpoint = "https://voteverse-backend-deploy.onrender.com/admin/adminLogin";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`${roleType} login successful!`);
        localStorage.setItem("token", data.token);
        if (roleType === "Admin"){
          localStorage.setItem("role","admin")
          console.log("AdminData: ",data.Admin)
          navigate("/admin");
        } 
        else if (roleType === "Candidate") {
          console.log("CandidateData: ",data.candidate)
           localStorage.setItem("role","candidate")
          navigate(`/candidateProfile/${data.candidate.rollNumber}`);
        }
        else {
          console.log("UserData: ",data.User)
           localStorage.setItem("role","voter")
          navigate(`/profile/${data.User.rollNumber}`)
        };
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again!");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        {/* Toggle Buttons */}
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

        <form onSubmit={handleSubmit} className="form-body">
          {/* Admin uses Email, Voter/Candidate use Aadhar */}
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
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Login as {roleType}
          </button>

          {/* Bottom Links */}
          
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
