

import React, { useState } from "react";
import ResultCharts from "./ResultCharts";
import "./ElectionResultModal.css";
import { useNavigate } from "react-router-dom";

const ElectionResultModal = ({ election, year, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("Head Boy");
  
  const { finalResults } = election;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2 className="modal-title">{year} – Final Results</h2>
        
        <div className="chart-tabs">
          {["Head Girl", "Head Boy"].map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
    
    {<ResultSection title="Final Results" results={activeCategory === "Head Boy"
              ? finalResults.headBoyResults
              : finalResults.headGirlResults} />}

        <ResultCharts
          results={
            activeCategory === "Head Boy"
              ? finalResults.headBoyResults
              : finalResults.headGirlResults
          }
          title={`${activeCategory} Vote Distribution`}
        />
      </div>
    </div>
  );
};

const ResultSection = ({ title, results = [] }) => {
  const navigate = useNavigate();
  if (!results.length) return null;

  return (
    <section className="result-section">
      <h3>{title}</h3>

      {results.map((r, i) => (
        <div
          key={r.candidateId}
          className={`result-card ${i === 0 ? "winner" : "runner"}`}
        >
          <span className="rank">{i === 0 ? "🥇 Winner" : "🥈 Runner-up"}</span>
          <span className="name">{r.name}</span>
          <span className="votes">{r.votes} votes</span>
          <button className="profile" onClick={() => navigate(`/candidateDetails/${r.rollNumber}`)}>View Profile</button>
        </div>
      ))}
    </section>
  );
};

export default ElectionResultModal;