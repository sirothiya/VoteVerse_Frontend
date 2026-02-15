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

  const handleMoreInfo = async () => {
     setLoading(true);
      setError("");
  
     if(candidate.profilecompleted)
     navigate(`/candidateDetails/${candidate.rollNumber}`);
     else setError("Candidate profile is not completed yet.")
      setLoading(false);
  

    // try {
    //   setLoading(true);
    //   setError("");

    //   const res = await fetch(
    //     `https://voteverse-backend-deploy.onrender.com/candidate/checkprofilestatus/${candidate.rollNumber}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     },
    //   );

    //   const data = await res.json();
    //   console.log("Profile status response:", data);

    //   if (!res.ok) {
    //     throw new Error(data.message || "Failed to check profile status");
    //   }

    //   if (!data.status || data.status !== "Completed") {
    //     setError("Candidate profile is not completed yet.");
    //     return;
    //   }
    //   navigate(`/candidateDetails/${candidate.rollNumber}`);
    // } catch (err) {
    //   setError(err.message || "Something went wrong");
    // } finally {
    //   setLoading(false);
    // }
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
