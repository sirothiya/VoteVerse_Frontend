// import { useState } from "react";
// import "../CssPages/LoginPage.css";
// import LogoComponent from "../../components/LogoComponent";
// import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [form, setForm] = useState({ aadhar: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginAs, setLoginAs] = useState("voter");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const voterLogin = async (e) => {
//     e.preventDefault();
//     console.log("Login Data:", form);
//     // send login request to backend here
//     //
//       try {
//         console.log("1");
//         const responseUser = await fetch(
//           "https://voteverse-backend.onrender.com/user/login",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(form),
//           }
//         );

//         if (responseUser.ok) {
//           const data = await responseUser.json();
//           localStorage.setItem("user", JSON.stringify(data.user));
//           localStorage.setItem("token", data.token);
//           console.log("usertoken",data.token);
//           localStorage.setItem(
//             "candidateData",
//             JSON.stringify(data.candidateData || []) // optional if backend sends it
//           );
//           console.log("userData:", data.user);
//           // setProfile(JSON.stringify(data.user));
//           console.log("Login Successful:", form);
//           alert("Login Successful");
//           if (data.user.role === "Admin") {
//             navigate("/admin");
//           } else {
//               navigate("/profile");
//           }
//         }
//         if (responseUser.status === 401) {
//           alert((await responseUser.json()).error);
//         }
//       } catch (err) {
//         console.error("Login error:", err);
//         alert("Login failed. Please try again.");
//       }
    
//     }
  

//   const candidateLogin = async (e) => {
//     e.preventDefault();
//     console.log("Login Data:", form);
//     try {
//         console.log("2");
//         const candidatResponse=await fetch('https://voteverse-backend.onrender.com/candidate/login',
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(form),
//           }
//         )
//         if(candidatResponse.ok){
//           const data = await candidatResponse.json();
//           localStorage.setItem("candidate", JSON.stringify(data.participant));
//           localStorage.setItem("token", data.token);
//           localStorage.setItem(
//             "candidateData",
//             JSON.stringify(data.candidateData || []) // optional if backend sends it
//           );
//           console.log("candidateData:", data.participant);
//           // setProfile(JSON.stringify(data.user));
//           console.log("Login Successful:", form);
//           alert("Login Successful");
//               navigate(`/candidateProfile/${data.id}`);
//           }
//         if (candidatResponse.status === 401) {
//           alert((await candidatResponse.json()).error);
//         }
//         }

//       catch (err) {
//        console.error("Login error:", err);
//         alert("Login failed. Please try again.");
//       }

//   };
//   const handleSubmit = loginAs === "voter" ? voterLogin : candidateLogin;
//   return (
//     <div className="login-container">
//       <LogoComponent />
//       <div className="login-card">
//         <h2 className="title">
//           {loginAs === "voter" ? "Voter" : "Candidate"} Login
//         </h2>
//         {loginAs === "voter" && (
//           <a onClick={() => setLoginAs("candidate")} className="link">
//             As Candidate?
//           </a>
//         )}
//         {loginAs === "candidate" && (
//           <a onClick={() => setLoginAs("voter")} className="link">
//             As Voter?
//           </a>
//         )}
//         <form onSubmit={handleSubmit} className="login-form">
//           <input
//             type="number"
//             name="aadhar"
//             placeholder="Aadhar Number"
//             value={form.aadhar}
//             onChange={handleChange}
//             required
//             className="input"
//           />
//           <div className="password-container">
//             <input
//               type={showPassword ? "text" : "password"} // toggles type
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               className="input"
//             />
//             <span
//               className="password-toggle-icon"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           <button type="submit" className="btn">
//             Login
//           </button>
//         </form>
//         <br></br>
//         {loginAs === "voter" && (
//           <p>
//             Don’t have an account?{" "}
//             <a href="/signup" className="link">
//               Sign Up
//             </a>
//           </p>
//         )}
//         {loginAs === "candidate" && (
//           <a href="/changePassword" className="link">
//             Change Password
//           </a>
//         )}
//       </div>
//       <button className="back-btns" onClick={() => navigate('/')}>Back</button>
//     </div>
//   );
// };

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
      endpoint = "https://voteverse-backend.onrender.com/user/userLogin";
    else if (roleType === "Candidate")
      endpoint = "https://voteverse-backend.onrender.com/candidate/candidateLogin";
    else endpoint = "https://voteverse-backend.onrender.com/admin/adminLogin";

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
          console.log("AdminData: ",data.Admin)
          navigate("/admin");
        } 
        else if (roleType === "Candidate") {
          console.log("CandidateData: ",data.Candidate)
          navigate(`/candidateProfile/${data.Candidate.rollNumber}`);
        }
        else {
          console.log("UserData: ",data.User)
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
