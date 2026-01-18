import React from "react";
import "./AllResultsModal.css";
import ElectionHistory from "./ElectionHistory";
import { useEffect,useState } from "react";
const AllResultsModal = ({  onClose }) => {
  // console.log("AllResultsModal elections data:", elections);
  const [electionHistory, setElectionHistory] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(()=>{

  const fetchElectionHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(
        "https://voteverse-backend-deploy.onrender.com/election/history"
      );
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setElectionHistory({});
        return;
      }
      console.log("Election history data:", data);
      setElectionHistory(data);
    } catch (err) {
      console.error("Failed to fetch election history", err);
    } finally {
      setLoadingHistory(false);
    }
  };
  fetchElectionHistory();
}, []);

  if (loadingHistory) {
    return (
      <div className="popup-overlay1">
        <div className="popup-content1 large">
          <h2>🏆 Election History</h2>
          <p className="result-loading">Loading results...</p>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay1">
      <div className="popup-content1 large">
        <h2>🏆 Election History</h2>
        {electionHistory?.map((election) => (
          <ElectionHistory
            key={election._id}
            election={election} // 👈 PASS SINGLE ELECTION
          />
        ))}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
export default AllResultsModal;
