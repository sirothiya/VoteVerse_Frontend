import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import "../CssPages/CandidateDetails.css";
import Loader from "../../components/Loader";
import { FaInfoCircle } from "react-icons/fa";

const sentimentColorMap = {
  Positive: "#22c55e",
  Negative: "#ef4444",
  Neutral: "#9ca3af",
};

const CandidateDetails = () => {
  const { rollNumber } = useParams();
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [profileStatus, setProfileStatus] = useState("Pending");

  const [explaining, setExplaining] = useState(false);
  const [explainingVideo, setExplainingVideo] = useState(false);
  const [videoExplanation, setVideoExplanation] = useState({
    summary: null,
    sentiment: null,
  });
  const [loadingManifesto, setLoadingManifesto] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [overallSentimentData, setOverallSentimentData] = useState([]);

  const [manifestoExplanation, setManifestoExplanation] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const normalizeSentiment = (raw) => {
    if (!raw) return "Neutral";

    return raw
      .replace(/\*\*sentiment:\*\*/i, "")
      .replace(/[^a-z]/gi, "")
      .trim();
  };

  const computeOverallSentiment = () => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    switch (videoExplanation?.sentiment?.[0]?.name) {
      case "Positive":
        positive += 40;
        break;
      case "Negative":
        negative += 40;
        break;
      default:
        neutral += 40;
    }

    manifestoExplanation
      ? ((positive += 25), (neutral += 15))
      : (neutral += 40);
    candidate.profilecompleted ? (positive += 20) : (neutral += 20);

    const total = positive + neutral + negative;
    if (total !== 100) neutral += 100 - total;

    return [
      { name: "Positive", value: positive },
      { name: "Neutral", value: neutral },
      { name: "Negative", value: negative },
    ].filter((d) => d.value > 0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const candidateInfo = JSON.parse(localStorage.getItem("candidate"));
    if (!token) return;
    let url;
    if (candidateInfo && candidateInfo.isELectionCompleted) {
      url = `https://voteverse-backend-new.onrender.com/candidate/results/candidate/${rollNumber}`;
    } else
      url = `https://voteverse-backend-new.onrender.com/candidate/${rollNumber}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCandidate(data.candidate);
        setProfileStatus(data.candidate?.status || "Pending");
      });
  }, [rollNumber]);

  useEffect(() => {
    if (!candidate) return;
    setOverallSentimentData(computeOverallSentiment());
  }, [candidate, videoExplanation.sentiment, manifestoExplanation]);

  const updateStatus = async (status) => {
    const token = localStorage.getItem("token");

    await fetch(
      `https://voteverse-backend-new.onrender.com/admin/updateStatus/${rollNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    );

    setProfileStatus(status);
    setCandidate((prev) => ({
      ...prev,
      status,
    }));
  };

  if (!candidate) return <Loader content="Loading ...." />;

  const explainManifesto = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    console.log("Explaining manifesto...");
    if (candidate?.manifesto?.summary) {
      setManifestoExplanation(candidate.manifesto.summary);
      return;
    }

    setExplaining(true);
    setManifestoExplanation("");
    setLoadingManifesto(true);
    try {
      const res = await fetch(
        `https://voteverse-backend-new.onrender.com/candidate/extract/manifesto/${candidate.rollNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      console.log("AI Response:", data);
      setManifestoExplanation(data.summary || "No explanation available.");
    } catch (err) {
      setManifestoExplanation("Unable to explain manifesto right now.");
    } finally {
      setExplaining(false);
      setLoadingManifesto(false);
    }
  };

  const explainVideo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingVideo(true);
    setExplainingVideo(true);

    try {
      const res = await fetch(
        `https://voteverse-backend-new.onrender.com/candidate/extract/video-summary/${candidate.rollNumber}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("Video Explanation Response:", data);
      if (data.summary && data.sentiment) {
        console.log("Video Explanation:", data);
        setVideoExplanation({
          summary: data.summary,
          sentiment: data.sentiment
            ? [
                {
                  name: normalizeSentiment(data.sentiment),
                  value: 100,
                },
              ]
            : [{ name: "Neutral", value: 100 }],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExplainingVideo(false);
      setLoadingVideo(false);
    }
  };

  return (
    <div className="candidate-details-container">
      <section className="candidate-hero">
        <div className="hero-column1">
          <div className="hero-tempo">
            <div className="hero-avatar-column">
              <img
                src={`https://voteverse-backend-new.onrender.com${candidate.profilePhoto}`}
                className="hero-avatar"
                alt="Candidate"
              />
              <p className="hero-label">Profile Photo</p>
            </div>

            <div className="hero-info">
              <button className="back-button" onClick={() => navigate(-1)}>
                {" "}
                ←Back
              </button>
              <h1>{candidate.name}</h1>
              <div className="details">
                <p>Class {candidate.class}</p>
                <span className="position-pill">{candidate.position}</span>
              </div>

              <div className="candidate-status-section">
                <div className="candidate-status-box">
                  <p className="candidate-status-label">
                    🧾 Candidate Status :{" "}
                    <span
                      className={`candidate-status-text ${
                        candidate?.profilecompleted ? "success" : "warning"
                      }`}
                    >
                      {candidate?.profilecompleted
                        ? "Profile Completed ✅"
                        : "Profile Incomplete ⚠️"}
                    </span>
                  </p>
                </div>

                <div className="candidate-status-box">
                  <p className="candidate-status-label">
                    🏛️ Admin Approval :{" "}
                    <span
                      className={`candidate-status-text ${
                        candidate?.status === "Approved"
                          ? "success"
                          : candidate?.status === "Rejected"
                            ? "danger"
                            : "pending"
                      }`}
                    >
                      {candidate?.status === "Approved"
                        ? "Approved ✅"
                        : candidate?.status === "Rejected"
                          ? "Rejected ❌"
                          : "Pending 🕓"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {candidate.partysymbol && (
          <div className="hero-column">
            <img
              src={`https://voteverse-backend-new.onrender.com${candidate.partysymbol}`}
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
                  <span className={`status1 ${profileStatus.toLowerCase()}`}>
                    {profileStatus}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="split">
        {candidate.achievements?.length > 0 && (
          <div className="card1">
            <h3>Achievements</h3>
            {candidate.achievements.length != 0 ? (
              <ul>
                {candidate.achievements.slice(0, 3).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            ) : (
              <p>No achievements listed by the candidate.</p>
            )}
          </div>
        )}

        {candidate.initiatives?.length > 0 && (
          <div className="card1">
            <h3>Initiatives</h3>
            {candidate.initiatives.length != 0 ? (
              <ul>
                {candidate.initiatives.slice(0, 3).map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            ) : (
              <p>No initiatives listed by the candidate.</p>
            )}
          </div>
        )}
      </section>

      {candidate.campaignVideo && (
        <section className="split">
          <div className="card1">
            <h3>Video Message</h3>
            <div className="video-placeholder">
              <p>🎥 Campaign video available</p>
              <button onClick={() => setShowVideo(true)}>
                ▶ Watch Campaign Message
              </button>
            </div>
          </div>
          <div className="card1">
            <h3>Campaign Summary</h3>
            <div className="manifesto-explanation">
              <h4>📹 Video Summary</h4>
              {loadingVideo && <Loader content="Analyzing Video..." />}
              <button
                className="explain-btn"
                onClick={explainVideo}
                disabled={explainingVideo}
              >
                {explainingVideo
                  ? "Analyzing Video..."
                  : "🧠 Explain Video Message"}
              </button>
              <div className="skip-format">
                <h4>Candidate stands for: </h4>
                <button
                  className="skip"
                  onClick={() =>
                    setVideoExplanation(() => ({
                      ...videoExplanation,
                      summary: null,
                    }))
                  }
                >
                  Skip ✖
                </button>
              </div>
              {videoExplanation.summary && (
                <pre>{videoExplanation.summary}</pre>
              )}
            </div>
          </div>
        </section>
      )}
      <section className="split">
        <div className="card1">
          <h3>Manifesto</h3>

          <a
            href={`https://voteverse-backend-new.onrender.com${candidate.manifesto?.pdfPath}`}
            target="_blank"
            rel="noreferrer"
          >
            📄 View Original PDF
          </a>

          <br />
          <br />

          <button
            className="explain-btn"
            onClick={explainManifesto}
            disabled={explaining}
          >
            {explaining ? "Explaining..." : "🧠 Explain Manifesto"}
          </button>
          {loadingManifesto && <Loader content="Analyzing Manifesto..." />}
          {manifestoExplanation && (
            <div className="manifesto-explanation">
              <div className="skip-format">
                <h4>Candidate stands for :</h4>
                <button
                  className="skip"
                  onClick={() => setManifestoExplanation("")}
                >
                  Skip ✖
                </button>
              </div>
              <pre>{manifestoExplanation}</pre>
            </div>
          )}

          <h3>Documents</h3>
          <br />
          <a
            href={`https://voteverse-backend-new.onrender.com${candidate.parentalConsent}`}
            target="_blank"
            rel="noreferrer"
          >
            📄 Parental Consent
          </a>

          <p>
            ✔ Eligibility:{" "}
            {candidate.declarationSigned ? "Confirmed" : "Not Confirmed"}
          </p>
        </div>

        <div className="card1">
          <h3>Public Sentiment</h3>
           <div className="sentiment-header">
          <span
            className="info-icon"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            onClick={() => setShowInfo(!showInfo)}
          >
            ⓘ
          </span>

          {showInfo && (
            <div className="info-tooltip">
              <p>
                • Sentiment is derived from a combined analysis of campaign
                video tone, manifesto content, and profile completeness using
                AI-driven text analysis and rule-based weighting.
              </p>
              <p>
                • This insight reflects probabilistic analysis, not factual
                verification, and should be used as a decision aid—not as a
                definitive judgment.
              </p>
            </div>
          )}
          </div>
          {overallSentimentData.length > 0 ? (
            <div className="sentiment-wrapper">
              <PieChart width={220} height={200}>
                <Pie
                  data={overallSentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                >
                  {overallSentimentData.map((item, i) => (
                    <Cell key={i} fill={sentimentColorMap[item.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>

              <div className="sentiment-legend">
                {overallSentimentData.map((s) => (
                  <p key={s.name}>
                    <span
                      className="dot"
                      style={{ background: sentimentColorMap[s.name] }}
                    />
                    {s.name}: {s.value}%
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="muted">
              Click “Explain Video Message” to analyze sentiment
            </p>
          )}
          
        </div>
      </section>

      {showVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setShowVideo(false)}
        >
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="close-modal">
              <button onClick={() => setShowVideo(false)}>✕</button>
            </div>

            <video
              controls
              src={`https://voteverse-backend-new.onrender.com${candidate.campaignVideo}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
