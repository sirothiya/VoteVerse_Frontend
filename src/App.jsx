import HomePage from './Pages/jsx/HomePage'
import Login from './Pages/jsx/LoginPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Pages/jsx/SignupPage';
import ProfilePage from './Pages/jsx/ProfilePage';
import Admin from './Pages/jsx/AdminPanel';
import Dashboard from './components/AdminComponents/Dashboard';
import ManageCandidates from './components/AdminComponents/ManageCandidates';
import PasswordChange from './components/PasswordChange';
import ElectionResults from './Pages/jsx/Result';
import CandidateDetails from './Pages/jsx/CandidateDetails';
import CandidateProfile from './Pages/jsx/CandidateProfile';
import HelpPanel from './components/HelpPanel';

const App=()=>{

  return(
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/HelpPanel" element={<HelpPanel />} />
      <Route path='/profile/:rollNumber' element={<ProfilePage/>}/>
      <Route path='/admin' element={<Admin/>}/>
      <Route path="/dashboard"element={<Dashboard/>}/>
      <Route path="/manageCandidate" element={<ManageCandidates/>}/>
      <Route path="/changePassword" element={<PasswordChange/>}/>
      <Route path="/result" element={<ElectionResults/>}/>
      <Route path='/candidateDetails/:rollNumber' element={<CandidateDetails/>}/>
      <Route path='/candidateProfile/:rollNumber'element={<CandidateProfile/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App