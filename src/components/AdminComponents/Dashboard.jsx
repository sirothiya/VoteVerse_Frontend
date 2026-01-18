import React, { useState, useEffect } from "react";
import CandidateCard from "./CandidateCard";
import "./Dashboard.css";
import CandidatesByCategory from "./CandidatesByCategory";

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
function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState(false);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);

  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCandidates = async () => {
      try {
        const response = await fetch(
          "https://voteverse-backend-deploy.onrender.com/candidate/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setCandidates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCandidates();

    if (!localStorage.getItem("announcementSetupDone")) {
      setShowAnnouncementPopup(true);
    }
  }, []);

  useEffect(() => {
    setShowPopup(showAnnouncementPopup);
  }, [showAnnouncementPopup]);


  const handleSubmit = async (formData) => {
    try {
      console.log("Submitting election setup:", formData);

      const response = await fetch(
        "https://voteverse-backend-deploy.onrender.com/admin/electionsetup",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            announcementMessage: [
              formData.announcement,
              `Election's candidate registration starts on ${formData.regStart} and will last till ${formData.regEnd}`,
              `Votting will start on ${formData.electionStart} and last for ${formData.electionDuration} hours.`,
            ],
            candidateRegStart:
              formData.regStart && formatISO8601(new Date(formData.regStart)),
            candidateRegEnd:
              formData.regEnd && formatISO8601(new Date(formData.regEnd)),
            electionStart:
              formData.electionStart &&
              formatISO8601(new Date(formData.electionStart)),
            electionDurationHours: Number(formData.electionDuration),
          }),
        }
      );

      const data = await response.json(); // ✔ read only once

      if (!response.ok) {
        throw new Error(data.message || "Failed to save setup");
      }

      console.log("Election setup response:", data); // ✔ Now valid
      console.log("Election Setup:", data.electionSetup);
      console.log("Message:", data.message);

      localStorage.setItem("announcementSetupDone", "true");
      alert("Election setup saved successfully!");
      setShowPopup(false);
      setShowAnnouncementPopup(false);
      setStatus(true);
    } catch (error) {
      console.error("Error saving setup:", error);
      alert("Failed to save setup. Please try again.");
    }
  };

  const handleResetElection = async () => {
    if (!window.confirm("This will end & reset the election. Continue?"))
      return;

    const res = await fetch(
      "https://voteverse-backend-deploy.onrender.com/admin/election/reset",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    console.log("Reset Election Response:", data);
    alert(data.message);
    window.location.reload();
  };

  return (
    <div className="dashboard">
      <h2 className="page-title">
        {safeCandidates.length === 0 ? "No Candidates" : "Candidates"}
      </h2>
      <div className="btn-group">
        <button className="start-election" onClick={() => setShowPopup(true)}>
          Make Announcement
        </button>
        <button className="danger-btn" onClick={handleResetElection}>
          🔴 Reset / Drop Election
        </button>
      </div>

      {showPopup && (
        <AnnouncementPopup
          onClose={() => {
            setShowPopup(false);
            setShowAnnouncementPopup(false);
          }}
          handleSubmit={handleSubmit}
        />
      )}

      
        <CandidatesByCategory candidates={safeCandidates} />

      
    </div>
  );
}

export default Dashboard;
