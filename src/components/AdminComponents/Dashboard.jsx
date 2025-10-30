// import React, { useState } from "react";
// import CandidateCard from "./CandidateCard";
// import "./Dashboard.css";
// import { useNavigate } from "react-router-dom";

// const formatISO8601 = (date) => {
//   const pad = (num) => String(num).padStart(2, "0");
//   const year = date.getUTCFullYear();
//   const month = pad(date.getUTCMonth() + 1);
//   const day = pad(date.getUTCDate());
//   const hours = pad(date.getUTCHours());
//   const minutes = pad(date.getUTCMinutes());
//   const seconds = pad(date.getUTCSeconds());
//   const ms = String(date.getUTCMilliseconds()).padStart(3, "0");
//   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}+00:00`;
// };
// const EndTimePopup = ({ endTime, setEndTime, onClose, handleStart }) => {
//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2> Enter Election End Time</h2>
//         <input
//           type="datetime-local"
//           value={endTime}
//           onChange={(e) => setEndTime(e.target.value)}
//         />
//         <button
//           className="close-btn"
//           onClick={() => {
//             onClose();
//             handleStart();
//           }}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// function Dashboard({ candidates }) {
//   const safeCandidates = Array.isArray(candidates) ? candidates : [];
//   const [endTime, setEndTime] = useState("");
//   const[status,setStatus]=useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleStart = async () => {
//     if(endTime==="")return
//     const end = new Date(endTime); // endTime from <input>
//     formatISO8601(end);
//     await fetch("https://voteverse-backend.onrender.com/election/start", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         endTime: end,
//         startTime: formatISO8601(new Date()),
//       }),
//     });
//     alert("Election started");
//     setStatus(true);

//   };
//   return (
//     <div className="dashboard">
//       <h2 className="page-title">
//         {safeCandidates.length === 0 ? "No Candidates" : "Candidates"}
//       </h2>

//        {!status && <button className="start-election" onClick={() => setShowPopup(true)}>
//           Announcement
//         </button>}

//       {showPopup && (
//         <EndTimePopup
//           endTime={endTime}
//           setEndTime={setEndTime}
//           onClose={() => setShowPopup(false)}
//           handleStart={handleStart}
//         />
//       )}
//       <div className="card-grid">
//         {safeCandidates.map((c) => (
//           <CandidateCard key={c.id} candidate={c} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import CandidateCard from "./CandidateCard";
import "./Dashboard.css";

const formatISO8601 = (date) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const ms = String(date.getUTCMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}+00:00`;
};

const AnnouncementPopup = ({ onClose, handleSubmit }) => {
  const [formData, setFormData] = useState({
    announcement: "",
    regStart: "",
    regEnd: "",
    electionStart: "",
    electionDuration: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content large">
        <h2>🗳️ Election Setup</h2>
        <label>Announcement Message:</label>
        <textarea
          name="announcement"
          value={formData.announcement}
          onChange={handleChange}
          placeholder="Enter announcement details..."
        />

        <label>Candidate Registration Start Date:</label>
        <input
          type="datetime-local"
          name="regStart"
          value={formData.regStart}
          onChange={handleChange}
        />

        <label>Candidate Registration End Date:</label>
        <input
          type="datetime-local"
          name="regEnd"
          value={formData.regEnd}
          onChange={handleChange}
        />

        <label>Election Start Date:</label>
        <input
          type="datetime-local"
          name="electionStart"
          value={formData.electionStart}
          onChange={handleChange}
        />

        <label>Election Duration (in hours):</label>
        <input
          type="number"
          name="electionDuration"
          value={formData.electionDuration}
          onChange={handleChange}
          placeholder="e.g., 24"
        />

        <div className="popup-actions">
          <button onClick={() => handleSubmit(formData)}>Submit</button>
          <button onClick={onClose} className="secondary">
            Do it later
          </button>
        </div>
      </div>
    </div>
  );
};

function Dashboard({ candidates, showPopupInitially, closeInitialPopup }) {
  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const [showPopup, setShowPopup] = useState(showPopupInitially || false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (showPopupInitially) setShowPopup(true);
  }, [showPopupInitially]);

  const handleSubmit = async (formData) => {
    try {
      const response =await fetch("https://voteverse-backend.onrender.com/election/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcement: formData.announcement,
          regStart: formatISO8601(new Date(formData.regStart)),
          regEnd: formatISO8601(new Date(formData.regEnd)),
          startTime: formatISO8601(new Date(formData.electionStart)),
          electionDuration: parseFloat(formData.electionDuration),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save setup");
      }
      const data=await response.json();
      console.log("Election setup response:", data.election);
      localStorage.setItem("announcementSetupDone", "true");
      alert("Election setup saved successfully!");
      setShowPopup(false);
      closeInitialPopup?.();
      setStatus(true);
    } catch (error) {
      console.error("Error saving setup:", error);
      alert("Failed to save setup. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <h2 className="page-title">
        {safeCandidates.length === 0 ? "No Candidates" : "Candidates"}
      </h2>

      <button className="start-election" onClick={() => setShowPopup(true)}>
        Announcement
      </button>

      {showPopup && (
        <AnnouncementPopup
          onClose={() => {
            setShowPopup(false);
            closeInitialPopup?.();
          }}
          handleSubmit={handleSubmit}
        />
      )}

      <div className="card-grid">
        {safeCandidates.map((c) => (
          <CandidateCard key={c.id || c._id} candidate={c} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
