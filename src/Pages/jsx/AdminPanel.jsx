// import React, { useEffect, useState } from "react";
// import Navbar from "../../components/AdminComponents/Navbar";
// import Dashboard from "../../components/AdminComponents/Dashboard";
// import ManageCandidates from "../../components/AdminComponents/ManageCandidates";
// import "../CssPages/AdminPanel.css";
// import ElectionResults from "./Result";


// const Admin=()=> {
//   const [page, setPage] = useState("dashboard");
//   const [candidates, setCandidates] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     console.log("Token in AdminPanel:", token);
//     const fetchCandidates = async () => {
//       try {
//         const candidateResponse = await fetch(
//           "https://voteverse-backend.onrender.com/candidate/",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const candidateData = await candidateResponse.json();
//         console.log("Candidate Data in AdminPanel:", candidateData);
//         setCandidates(candidateData);

//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchCandidates();
//   }, [page]); // run once

//   return (
//     <div className="admin">
//       <Navbar setPage={setPage} />
//       <div className="content">
//         {page === "dashboard" && <Dashboard candidates={candidates} setPage={setPage}/>}
//         {page === "manage" && (
//           <ManageCandidates
//             candidates={candidates}
//             setCandidates={setCandidates}
//           />
//         )}
//         {page === "result" && <ElectionResults setPage={setPage}/>}
//       </div>
//     </div>
//   );
// };


// export default Admin;



import React, { useEffect, useState } from "react";
import Navbar from "../../components/AdminComponents/Navbar";
import Dashboard from "../../components/AdminComponents/Dashboard";
import ManageCandidates from "../../components/AdminComponents/ManageCandidates";
import ElectionResults from "./Result";
import "../CssPages/AdminPanel.css";

const Admin = () => {
  const [page, setPage] = useState("dashboard");
  const [candidates, setCandidates] = useState([]);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in AdminPanel:", token);

    const fetchCandidates = async () => {
      try {
        const response = await fetch(
          "https://voteverse-backend.onrender.com/candidate/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Candidate Data in AdminPanel:", data);
        setCandidates(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCandidates();

    // Show popup only on first admin login (can store a flag in localStorage)
    const alreadySetup = localStorage.getItem("announcementSetupDone");
    if (!alreadySetup) {
      setShowAnnouncementPopup(true);
    }
  }, [page]);

  return (
    <div className="admin">
      <Navbar setPage={setPage} />
      <div className="content">
        {page === "dashboard" && (
          <Dashboard
            candidates={candidates}
            setPage={setPage}
            showPopupInitially={showAnnouncementPopup}
            closeInitialPopup={() => setShowAnnouncementPopup(false)}
          />
        )}
        {page === "manage" && (
          <ManageCandidates
            candidates={candidates}
            setCandidates={setCandidates}
          />
        )}
        {page === "result" && <ElectionResults setPage={setPage} />}
      </div>
    </div>
  );
};

export default Admin;
