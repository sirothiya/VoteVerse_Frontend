import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../CssPages/SignupPage.css";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [roleType, setRoleType] = useState("Voter");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    class: "",
    dob: "",
    gender: "",
    position: "",
    email: "",
    schoolName: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleToggle = async (type) => {
    if (type === "Admin") {
      try {
        const response = await fetch(
          "https://voteverse-backend-deploy.onrender.com/admin/"
        );
        if (!response.ok) {
          console.error("Error fetching admin status:", response.status);
        }
        const admin = await response.json();
        console.log("Admin data:", admin);
      } catch (err) {
        console.log("Error in admin fetch:", err);
      }
    }

    setRoleType(type);
    setFormData({
      name: "",
      rollNumber: "",
      class: "",
      dob: "",
      gender: "",
      position: "",
      email: "",
      schoolName: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill position based on gender
    if (name === "gender") {
      let autoPosition = "";

      if (value === "Male") autoPosition = "Head Boy";
      else if (value === "Female") autoPosition = "Head Girl";

      setFormData((prev) => ({
        ...prev,
        gender: value,
        position: autoPosition,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoints = {
      Voter: "https://voteverse-backend-deploy.onrender.com/user/userSignup",
      Candidate:
        "https://voteverse-backend-deploy.onrender.com/candidate/candidateSignup",
      Admin: "https://voteverse-backend-deploy.onrender.com/admin/adminSignup",
    };

    const endpoint = endpoints[roleType];

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || `${roleType} signup successful!`);
        setFormData({
          name: "",
          rollNumber: "",
          class: "",
          dob: "",
          gender: "",
          position: "",
          email: "",
          schoolName: "",
          password: "",
        });
        navigate(`/login`);
      } else {
        alert(data.error || "Signup failed!");
        console.log("Error:", data.error);
      }
    } catch (error) {
      console.error("Error in signup:", error);
      alert("Something went wrong!");
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
              {role} Signup
            </button>
          ))}
        </div>

        <h2 className="form-title">{roleType} Registration</h2>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Name</label>
            <input
            className="form-control"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Admin fields */}
          {roleType === "Admin" && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                className="form-control"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </div>

              <div className="form-group">
                <label>School Name</label>
                <input
                className="form-control"
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school name"
                  required
                />
              </div>
            </>
          )}

          {/* Voter/Candidate shared fields */}
          {roleType !== "Admin" && (
            <>
              <div className="form-group">
                <label>Roll Number</label>
                <input
                className="form-control"
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 22CS001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Class</label>
                <input
                  className="form-control"
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="e.g. 10-B"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                className="form-control"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Candidate-only fields */}
          {roleType === "Candidate" && (
            <>
              <div className="form-group">
                <label>Gender</label>
                <select
                className="form-control"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Position</label>
                <select
                className="form-control"
                  name="position"
                  value={formData.position}
                  disabled={!!formData.gender} // 🔒 locked after gender selection
                  required
                >
                  <option value="">Select Position</option>
                  <option>Head Boy</option>
                  <option>Head Girl</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
              className="form-control"
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
            Register as {roleType}
          </button>
          <p className="switch-link">
            Already have an account?{" "}
            <a href="/login" className="link">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
