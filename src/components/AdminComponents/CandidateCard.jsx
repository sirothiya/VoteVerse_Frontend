import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../UI/Cards";
import { Button } from "../UI/Button";
import "./CandidateCards.css";

const CandidateCard = ({ candidate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const loggedInRoll = candidate.rollNumber;

  const handleMoreInfo = () => {
    setLoading(true);
    setError("");

    if (candidate.profilecompleted) {
      navigate(`/candidateDetails/${candidate.rollNumber}`);
      setLoading(false);
    } else {
      setError("Candidate profile is not completed yet.");
      setLoading(false);
    }
  };

  return (
    <Card className="candidate-card1">
      <CardContent className="candidate-card-content1">
        {/* STATUS BADGE */}
        <span className={`candidate-status ${candidate.status?.toLowerCase()}`}>
          {candidate.status}
        </span>

        <img
          src={`https://voteverse-backend-new.onrender.com${candidate.profilePhoto}`}
          className="candidate-avatar1"
          alt={candidate.name}
        />

        <h2 className="candidate-name1">{candidate.name}</h2>

        <p className="candidate-info1p">
          <strong className="candidate-info1strong">Class:</strong>{" "}
          {candidate.class}
        </p>

        <div className="candidate-info1">
          <p className="candidate-info1p">
            <strong className="candidate-info1strong">Position:</strong>{" "}
            {candidate.position}
          </p>
        </div>

        <button
          type="button"
          onClick={handleMoreInfo}
          disabled={loading}
          className="candidate-btn1"
        >
          {loading ? "Loading..." : "More Info"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default CandidateCard;