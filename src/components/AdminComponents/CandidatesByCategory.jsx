import React from "react";

import "./CandidatesByCategory.css";
import CandidateCard from "./CandidateCard";

const CandidatesByCategory = ({ candidates }) => {
  // Group candidates by position
  const grouped = candidates.reduce((acc, candidate) => {
    const key = candidate.position;
    if (!acc[key]) acc[key] = [];
    acc[key].push(candidate);
    return acc;
  }, {});

  return (
    <div className="category-container">
      {Object.entries(grouped).map(([position, list]) => (
        <section key={position} className="category-section">
          <div className="category-header">
            <h2 className="category-title">{position}:</h2>
            <span className="category-count">{list.length}</span>
          </div>

          {/* ✅ SCROLL PER CATEGORY */}
          <div className="category-scroll">
            {list.map((candidate) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CandidatesByCategory;
