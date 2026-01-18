import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import "../CssPages/CandidateDetails.css";

const COLORS = ["#22c55e", "#ef4444", "#9ca3af"];

const CandidateDetails = () => {
  const { rollNumber } = useParams();
  const role = localStorage.getItem("role");

  const [showVideo, setShowVideo] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [profileStatus, setProfileStatus] = useState("Pending");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(
      `https://voteverse-backend-deploy.onrender.com/candidate/${rollNumber}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCandidate(data.candidate);
        setProfileStatus(data.candidate?.status || "Pending");
      });
  }, [rollNumber]);

  const updateStatus = async (status) => {
    const token = localStorage.getItem("token");

    await fetch(
      `https://voteverse-backend-deploy.onrender.com/admin/updateStatus/${rollNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    setProfileStatus(status);
  };

  if (!candidate) {
    return <p className="loading">Loading...</p>;
  }

  const sentimentData = [
    { name: "Positive", value: 65 },
    { name: "Negative", value: 20 },
    { name: "Neutral", value: 15 },
  ];

  return (
    <div className="candidate-details-container">
      {/* ================= HERO ================= */}
      <section className="candidate-hero">
        {/* LEFT SIDE */}
        <div className="hero-column1">
          <div className="hero-tempo">
            <div className="hero-avatar-column">
              <img
                src={`https://voteverse-backend-deploy.onrender.com${candidate.profilePhoto}`}
                className="hero-avatar"
                alt="Candidate"
              />
              <p className="hero-label">Profile Photo</p>
            </div>

            <div className="hero-info">
              <h1>{candidate.name}</h1>
              <p>Class {candidate.class}</p>
              <span className="position-pill">{candidate.position}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        {candidate.partysymbol && (
          <div className="hero-column">
            <img
              src={`https://voteverse-backend-deploy.onrender.com${candidate.partysymbol}`}
              className="party-symbol"
              alt="Party Symbol"
            />
            <p className="hero-label">Party Symbol</p>

            {role === "admin" && (
              <div className="hero-column-buttons">
                {profileStatus === "Pending" ? (
                  <>
                    <button
                      className="approve"
                      onClick={() => updateStatus("Approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="reject"
                      onClick={() => updateStatus("Rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`status1 ${profileStatus.toLowerCase()}`}
                  >
                    {profileStatus}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ================= ACHIEVEMENTS & INITIATIVES ================= */}
      <section className="split">
        {candidate.achievements?.length > 0 && (
          <div className="card1">
            <h3>Achievements</h3>
            <ul>
              {candidate.achievements.slice(0, 3).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {candidate.initiatives?.length > 0 && (
          <div className="card1">
            <h3>Initiatives</h3>
            <ul>
              {candidate.initiatives.slice(0, 3).map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ================= VIDEO ================= */}
      {candidate.campaignVideo && (
        <section className="card1">
          <h3>Video Message</h3>
          <div className="video-placeholder">
            <p>
              🎥 Campaign video is available. Summary will be generated using AI.
            </p>
            <button onClick={() => setShowVideo(true)}>
              ▶ Watch Campaign Message
            </button>
          </div>
        </section>
      )}

      {/* ================= GRID ================= */}
      <section className="content-grid1">
        <div className="card1">
          <h3>Campaign Summary</h3>
          <p>{candidate.campaignSummary || "No summary provided."}</p>
        </div>

        <div className="card1">
          <h3>Documents</h3>
          <a
            href={`https://voteverse-backend-deploy.onrender.com${candidate.manifesto}`}
            target="_blank"
            rel="noreferrer"
          >
            📄 Manifesto
          </a>
          <br />
          <a
            href={`https://voteverse-backend-deploy.onrender.com${candidate.parentalConsent}`}
            target="_blank"
            rel="noreferrer"
          >
            📄 Parental Consent
          </a>
          <div>
            ✔ Eligibility:{" "}
            {candidate.declarationSigned ? "Confirmed" : "Not Confirmed"}
          </div>
        </div>

        <div className="card1">
          <h3>Public Sentiment</h3>
          <PieChart width={220} height={200}>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
            >
              {sentimentData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      {showVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="close-modal">
              <button onClick={() => setShowVideo(false)}>✕</button>
            </div>

            <video
              controls
              src={`https://voteverse-backend-deploy.onrender.com${candidate.campaignVideo}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
