import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../UI/Cards";
import { Button } from "../UI/Button";
import "./CandidateCards.css"

const CandidateCard = ({ candidate }) => {
  const navigate = useNavigate();

  const handleMoreInfo = () => {
    navigate(`/candidateDetails/${candidate.rollNumber}`); // Navigate to detailed page
  };

  return (
    <Card className="candidate-card1">
  <CardContent className="candidate-card-content1">

    {/* STATUS BADGE */}
    <span className={`candidate-status ${candidate.status?.toLowerCase()}`}>
      {candidate.status}
    </span>

    <img
      src={`https://voteverse-backend-deploy.onrender.com${candidate.profilePhoto}`}
      className="candidate-avatar1"
      alt={candidate.name}
    />

    <h2 className="candidate-name1">{candidate.name}</h2>

    <p className="candidate-info1p">
      <strong className="candidate-info1strong">Class:</strong> {candidate.class}
    </p>

    <div className="candidate-info1">
      <p className="candidate-info1p">
        <strong className="candidate-info1strong">Position:</strong> {candidate.position}
      </p>
    </div>

    <Button className="candidate-btn1" onClick={handleMoreInfo}>
      More Info
    </Button>

  </CardContent>
</Card>


  );
};

export default CandidateCard;
