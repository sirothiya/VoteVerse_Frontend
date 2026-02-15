// import React, { useState } from "react";
// import "./HelpPanel.css";
// import { useEffect } from "react";
// import VotingTour from "./VotingTour";

// const HelpPanel = () => {
//   const [open, setOpen] = useState(false);
//   const [showTour, setShowTour] = useState(false);
//   const [election, setElection] = useState(null);

//   useEffect(()=>{
//   const fetchElection=async()=>{
//     try{
//       const electionfetch=await fetch(`https://voteverse-backend-new.onrender.com/election/status`);
//       const electionJson=await electionfetch.json();
//       setElection(electionJson);
//       console.log("Fetched election data:", electionJson);
//     }
//     catch(err){
//       console.error("Error fetching election data:", err);
//     }
//   }
//   fetchElection();
//   })

//   return (
//     <div className="help-panel-wrapper">
    
//         <div className="help-panel">
//           <h3>🗳 Election Help</h3>

//           <section className="help-section">
//             <h4>Election Info</h4>
//             <p><b>Session:</b> {election ? election.electionSession : "No info available"}</p>
//             <p><b>Status:</b> {election ? election.status : "No info available"}</p>
//             <p><b>Start Date:</b> {election ? new Date(election.startTime).toLocaleString() : "No info available"}</p>
//             <p><b>End Date:</b> {election ? new Date(election.endTime).toLocaleString() : "No info available"}</p>
//           </section>

//           <section>
//             <h4>Who Can Vote?</h4>
//             <ul>
//               <li>Registered students only</li>
//               <li>Valid ID & password required</li>
//             </ul>
//           </section>

//           <section>
//             <h4>Voting Rules</h4>
//             <ul>
//               <li>One vote per position</li>
//               <li>Only admin-approved candidates</li>
//               <li>Vote cannot be changed</li>
//             </ul>
//           </section>

//           <section>
//             <h4>Results</h4>
//             <p>
//               Results appear after election ends.  
//               Calculation may take some time.
//             </p>
//           </section>

//           <button className="tour-btn" onClick={() => setShowTour(true)}>
//             ▶ Take Voting Tour
//           </button>
//         </div>
      

//       {showTour && <VotingTour onClose={() => setShowTour(false)} />}
//     </div>
//   );
// };

// export default HelpPanel;
import React, { useEffect, useRef, useState } from "react";
import "./HelpPanel.css";
import VotingTour from "./VotingTour";

const HelpPanel = ({ onClose }) => {
  const panelRef = useRef(null);
  const [showTour, setShowTour] = useState(false);
  const [election, setElection] = useState(null);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await fetch(
          "https://voteverse-backend-new.onrender.com/election/status"
        );
        const data = await res.json();
        setElection(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchElection();
  }, []);

  // 👉 CLICK OUTSIDE HANDLER
  useEffect(() => {
  const handleClickOutside = (e) => {
    // 🚫 If voting tour is open, ignore outside clicks
    if (showTour) return;

    if (panelRef.current && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [onClose, showTour]);

  return (
    <div className="help-panel-backdrop">
      <div className="help-panel-wrapper">
        <div className="help-panel" ref={panelRef}>
          <h3>🗳 Election Help</h3>

          <section>
            <h4>Election Info</h4>
            <p><b>Session:</b> {election?.electionSession || "No Info Available"}</p>
            <p><b>Status:</b> {election?.status || "No Info Available"}</p>
            <p><b>Start:</b> {election ? new Date(election.startTime).toLocaleString() : "No Info Available"}</p>
            <p><b>End:</b> {election ? new Date(election.endTime).toLocaleString() : "No Info Available"}</p>
          </section>

          <section>
            <h4>Who Can Vote?</h4>
            <ul>
              <li>Registered students only</li>
              <li>Valid ID & password required</li>
            </ul>
          </section>

          <section>
            <h4>Voting Rules</h4>
            <ul>
              <li>One vote per position</li>
              <li>Only admin-approved candidates</li>
              <li>Vote cannot be changed</li>
            </ul>
          </section>

          <section>
            <h4>Results</h4>
            <p>Results appear after election ends.</p>
          </section>

          <button className="tour-btn" onClick={() => setShowTour(true)}>
            ▶ Take Voting Tour
          </button>
        </div>
      </div>

      {showTour && <VotingTour onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default HelpPanel;
