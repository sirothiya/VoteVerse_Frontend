// import HomePage from './Pages/jsx/HomePage'
// import Login from './Pages/jsx/LoginPage';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Signup from './Pages/jsx/SignupPage';
// import ProfilePage from './Pages/jsx/ProfilePage';
// import Admin from './Pages/jsx/AdminPanel';
// import Dashboard from './components/AdminComponents/Dashboard';
// import ManageCandidates from './components/AdminComponents/ManageCandidates';
// import PasswordChange from './components/PasswordChange';
// import ElectionResults from './Pages/jsx/Result';
// import CandidateDetails from './Pages/jsx/CandidateDetails';
// import CandidateProfile from './Pages/jsx/CandidateProfile';
// import HelpPanel from './components/HelpPanel';
// import './App.css'

// const App=()=>{

//   return(
//    <BrowserRouter>
//     <Routes>
//       <Route path='/' element={<HomePage/>}/>
//       <Route path="/login" element={<Login/>}/>
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/HelpPanel" element={<HelpPanel />} />
//       <Route path='/profile/:rollNumber' element={<ProfilePage/>}/>
//       <Route path='/admin' element={<Admin/>}/>
//       <Route path="/dashboard"element={<Dashboard/>}/>
//       <Route path="/manageCandidate" element={<ManageCandidates/>}/>
//       <Route path="/changePassword" element={<PasswordChange/>}/>
//       <Route path="/result" element={<ElectionResults/>}/>
//       <Route path='/candidateDetails/:rollNumber' element={<CandidateDetails/>}/>
//       <Route path='/candidateProfile/:rollNumber'element={<CandidateProfile/>}/>
//     </Routes>
//     </BrowserRouter>
   
//   )
// }

// export default App

import HomePage from "./Pages/jsx/HomePage";
import Login from "./Pages/jsx/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./Pages/jsx/SignupPage";
import ProfilePage from "./Pages/jsx/ProfilePage";
import Admin from "./Pages/jsx/AdminPanel";
import Dashboard from "./components/AdminComponents/Dashboard";
import ManageCandidates from "./components/AdminComponents/ManageCandidates";
import PasswordChange from "./components/PasswordChange";
import ElectionResults from "./Pages/jsx/Result";
import CandidateDetails from "./Pages/jsx/CandidateDetails";
import CandidateProfile from "./Pages/jsx/CandidateProfile";
import HelpPanel from "./components/HelpPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const App = () => {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/HelpPanel" element={<HelpPanel />} />

        {/* Voter-only */}
        <Route
          path="/profile/:rollNumber"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Candidate-only */}
        <Route
          path="/candidateProfile/:rollNumber"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manageCandidate"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageCandidates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute allowedRoles={["admin", "voter", "candidate"]}>
              <ElectionResults />
            </ProtectedRoute>
          }
        />

        {/* Admin + Candidate */}
        <Route
          path="/candidateDetails/:rollNumber"
          element={
            <ProtectedRoute allowedRoles={["admin", "candidate", "voter"]}>
              <CandidateDetails />
            </ProtectedRoute>
          }
        />

        {/* Any logged-in user */}
        <Route
          path="/changePassword"
          element={
            <ProtectedRoute allowedRoles={["admin", "candidate", "voter"]}>
              <PasswordChange />
            </ProtectedRoute>
          }
        />
      </Routes>
   
  );
};

export default App;