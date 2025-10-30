import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/UI/Cards";
import { Button } from "../../components/UI/Button";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import "../CssPages/CandidateDetails.css";
import { useParams } from "react-router-dom";

const CandidateDetails = () => {
  const [candidate, setCandidate] = useState(null);
  const [sentimentData, setSentimentData] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const { rollNumber } = useParams();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    const fetchCandidate = async () => {
      try {
        const res = await fetch(
          `https://voteverse-backend.onrender.com/candidate/${rollNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        const data = await res.json();
        console.log("data: ",data.candidate)
        setCandidate(data.candidate);

        setSentimentData([
          { name: "Positive", value: 65 },
          { name: "Negative", value: 20 },
          { name: "Neutral", value: 15 },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCandidate();
  }, [rollNumber]);

  const COLORS = ["#4caf50", "#f44336", "#9e9e9e"];

  if (!candidate) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading candidate details...</p>
      </div>
    );
  }

  return (
    <div className="candidate-details-container">
      {/* Profile Header */}
      <div className="profile-header-card">
        <img
          src={candidate.profilePhoto || "/default-avatar.png"}
          alt="Candidate"
          className="profile-photo-large"
        />
        <div>
          <h1 className="candidate-name">{candidate.name}</h1>
          <p className="candidate-meta">
            <strong>Class:</strong> {candidate.class || "N/A"} &nbsp; || &nbsp;
            <strong>Gender:</strong> {candidate.gender || "N/A"} &nbsp; || &nbsp;
            <strong>Position:</strong> {candidate.position || "N/A"}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="candidate-grid">
        {/* LEFT SIDE */}
        <div className="column">
          <Card className="card-custom gradient-blue">
            <CardContent>
              <h2 className="section-title">Election Information</h2>
              <p>
                <strong>Manifesto:</strong>{" "}
                {candidate.manifesto || "Not provided"}
              </p>
              {candidate.manifestoFile && (
                <a
                  href={`https://voteverse-backend.onrender.com${candidate.manifesto}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  📄 View Manifesto
                </a>
              )}

              <h3 className="card-subtitle">Campaign Video</h3>
              {candidate.video ? (
                <video controls className="video-player" src={`https://voteverse-backend.onrender.com${candidate.campaignVideo}`} />
              ) : (
                <p>No video uploaded</p>
              )}
            </CardContent>
          </Card>

          {candidate.achievements?.length > 0 && (
            <Card className="card-custom gradient-green">
              <CardContent>
                <h2 className="section-title">
                  Achievements & Extracurriculars
                </h2>
                <ul className="custom-list">
                  {candidate.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </CardContent>
              <CardContent>
                <h2 className="section-title">Initiatives Taken</h2>
                <ul className="custom-list">
                  {candidate.initiatives.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="column">
          {candidate.initiatives?.length > 0 && (
            <Card className="card-custom gradient-purple">
              <CardContent>
                <h2 className="section-title">Proposed Initiatives</h2>
                <ul className="custom-list">
                  {candidate.initiatives.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          <Card className="card-custom gradient-blue">
            <CardContent>
              <h2 className="section-title">Public Sentiment</h2>
              <PieChart width={280} height={220}>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>

          <Card className="card-custom gradient-gray">
            <CardContent>
              <h2 className="section-title">Eligibility & Consent</h2>
              <p>
                <strong>Declaration:</strong>{" "}
                {candidate.declarationSigned
                  ? "✅ Confirmed eligibility"
                  : "❌ Not confirmed"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="compare-btn-container">
        <Button
          onClick={() => setCompareList([...compareList, candidate])}
          className="compare-btn"
        >
          ➕ Add to Compare
        </Button>
      </div>
    </div>
  );
};

export default CandidateDetails;

