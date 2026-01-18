import React, { useEffect, useState } from "react";
import ElectionResultModal from "./ElectionResultModal";
import "./ElectionHistory.css";


const ElectionHistory = ({ election }) => {
  const [open, setOpen] = useState(false);

  const { startTime, endTime, finalResults } = election;
  const year = new Date(startTime).getFullYear();

  return (
    <>
      <div className="history-card">
        <div>
          <h3>{year} Election</h3>
          <p>
            {new Date(startTime).toLocaleDateString()} –{" "}
            {new Date(endTime).toLocaleDateString()}
          </p>
          <p>Total Votes: {finalResults.totalVotes}</p>
        </div>

        <button className="view-btn" onClick={() => setOpen(true)}>
          View Results
        </button>
      </div>

      {open && (
        <ElectionResultModal
          election={election}     // 👈 PASS SAME OBJECT
          year={year}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};


export default ElectionHistory;
