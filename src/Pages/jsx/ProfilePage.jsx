import { useNavigate, useParams } from "react-router-dom";
import "../CssPages/ProfilePage.css";
import { useEffect, useState } from "react";
import ElectionResults from "./Result";
import CountDown from "../../components/CountDown";
import AllResultsModal from "../../components/AllResultsModal";

// ----------------------------------------
// POPUPS
// ----------------------------------------
const VotePopup = ({ name, onClose }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <h2>🎉 Vote Casted Successfully</h2>
      <p>to {name}</p>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

const ElectionEndedPopup = ({ onClose }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <h2>🎉 Election Ended</h2>
      <p>The election has concluded. See the results below.</p>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { rollNumber } = useParams();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  const [candidates, setCandidates] = useState([]);
  const [visibleCandidates, setVisibleCandidates] = useState([]);

  const [electionSetup, setElectionSetup] = useState({});
  const [electionActive, setElectionActive] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [votedTo, setVotedTo] = useState("");
  const [showElectionEndedPopup, setShowElectionEndedPopup] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [showAllResults, setShowAllResults] = useState(false);

  // ----- Helper flags -----
  const now = currentTime;

  const isRegOpen =
    electionSetup.candidateRegStart &&
    electionSetup.candidateRegEnd &&
    now >= new Date(electionSetup.candidateRegStart) &&
    now < new Date(electionSetup.candidateRegEnd);

  const isElectionOpen =
    electionSetup.electionStart &&
    electionSetup.electionEnd &&
    now >= new Date(electionSetup.electionStart) &&
    now < new Date(electionSetup.electionEnd);

  const isElectionEnded = electionActive?.status === "COMPLETED";

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setToken(token);

    const fetchUser = async () => {
      const res = await fetch(
        `https://voteverse-backend-deploy.onrender.com/user/profile/${rollNumber}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setUser(data.user);
    };

    const fetchStatus = async () => {
      const res = await fetch(
        "https://voteverse-backend-deploy.onrender.com/election/status",
      );
      const data = await res.json();
      console.log("Election Status Data:", data);
      setElectionActive(data);
    };

    const fetchCandidates = async () => {
      const res = await fetch(
        "https://voteverse-backend-deploy.onrender.com/candidate/",
      );
      const data = await res.json();
      setCandidates(data);
    };

    const fetchSetup = async () => {
      const res = await fetch(
        "https://voteverse-backend-deploy.onrender.com/admin/electionSetup",
      );
      const data = await res.json();
      console.log("Election Setup Data:", data);
      setElectionSetup(data);
    };

    const refreshData = async () => {
      await Promise.all([
        fetchUser(),
        fetchStatus(),
        fetchCandidates(),
        fetchSetup(),
      ]);
    };

    refreshData().then(() => setLoading(false));

    let interval = null;

    if (!showPopup && !showElectionEndedPopup) {
      // if (isRegOpen || isElectionOpen) {
      //   interval = setInterval(refreshData, 5000);
      // }
      // if (!isElectionEnded && (isRegOpen || isElectionOpen)) {
      //   interval = setInterval(refreshData, 5000);
      // }
      interval = setInterval(async () => {
        await refreshData();

        // stop polling ONLY when results are ready
        if (
          electionActive?.status === "COMPLETED" &&
          electionActive?.resultsCalculated
        ) {
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rollNumber, isRegOpen, isElectionOpen, isElectionEnded]);

  const showCandidates =
    electionSetup.candidateRegStart &&
    electionSetup.electionEnd &&
    now >= new Date(electionSetup.candidateRegStart) &&
    now < new Date(electionSetup.electionEnd);

  useEffect(() => {
    if (!candidates.length) return;

    if (isElectionEnded) {
      setVisibleCandidates([]);
      return;
    }
    const approved = candidates.filter((c) => c.status === "Approved");

    if (showCandidates) {
      setVisibleCandidates(approved);
    } else {
      setVisibleCandidates([]);
    }
  }, [candidates, electionSetup, isElectionEnded]);

  const hasVoted =
    user?.isVoted || localStorage.getItem("userVoted") === "true";
  // console.log("User voting status:", user?.isVoted);

  const handleVote = async (id, name) => {
    try {
      const res = await fetch(
        `https://voteverse-backend-deploy.onrender.com/election/vote/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }

      setVotedTo(name);
      setShowPopup(true);
      localStorage.setItem("userVoted", "true");

      const userRes = await fetch(
        `https://voteverse-backend-deploy.onrender.com/user/profile/${rollNumber}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const updatedUser = await userRes.json();
      setUser(updatedUser.user);
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  // const handleExpire = () => {

  //   setShowElectionEndedPopup(true);

  // };

  const handleExpire = async () => {
    setShowElectionEndedPopup(true);
  };

  // 1️⃣ Filter only approved candidates
  const approvedCandidates = visibleCandidates.filter(
    (c) => c.status === "Approved",
  );

  // 2️⃣ Group by position (category)
  const groupedCandidates = approvedCandidates.reduce((acc, candidate) => {
    const key = candidate.position;
    if (!acc[key]) acc[key] = [];
    acc[key].push(candidate);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="profile-container">
      <div className="div-header">
        <h1 className="div-title">Welcome!! {user?.name}</h1>

        <button
          className="show-results-btn"
          onClick={() => {
            setShowAllResults(true);
          }}
        >
          🏆 Show All Results
        </button>
      </div>
      <div className="side-by-side">
        <p>🗳️ Voting Status: </p>
        <span className={user?.isVoted ? "voted" : "not-voted"}>
          {user?.isVoted ? "You have voted!" : "Not voted yet"}
        </span>
      </div>

      {!isElectionEnded && (
        <section className="card announcement-wrapper">
          <div className="announcement-content">
            <h2>📜 Announcements</h2>
            <ul>
              {electionSetup.announcementMessage?.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>

          {isElectionOpen && (
            <div className="announcement-countdown">
              <CountDown
                startTime={electionSetup.electionStart}
                endTime={electionSetup.electionEnd}
                onExpire={handleExpire}
                compact
              />
            </div>
          )}
        </section>
      )}

      {isElectionEnded && !electionActive?.resultsCalculated && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Calculating results, please wait...</p>
        </div>
      )}

      {isElectionEnded && electionActive?.resultsCalculated && (
        <ElectionResults />
      )}
      {showAllResults && (
        <AllResultsModal onClose={() => setShowAllResults(false)} />
      )}

      {showCandidates && (
        <section className="card">
          <h2>Approved Candidates</h2>

          {Object.keys(groupedCandidates).length ? (
            Object.entries(groupedCandidates).map(([position, candidates]) => (
              <div key={position} className="candidate-category">
                {/* CATEGORY TITLE */}
                <h3 className="candidate-category-title">{position}</h3>

                {/* CANDIDATES GRID */}
                <div className="candidate-grid">
                  {candidates.map((c) => (
                    <div
                      key={c._id}
                      className="candidate-card"
                      onClick={() =>
                        navigate(`/candidateDetails/${c.rollNumber}`)
                      }
                    >
                      <img
                        src={`https://voteverse-backend-deploy.onrender.com${c.profilePhoto}`}
                        className="candidate-avatar"
                        alt={c.name}
                      />

                      <p className="candidate-name">{c.name}</p>

                      {/* Vote Button only during election */}
                      {isElectionOpen && !user?.isVoted && (
                        <button
                          className="vote-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(c._id, c.name);
                          }}
                        >
                          Vote Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No approved candidates available right now.</p>
          )}
        </section>
      )}

      {/* POPUPS */}
      {showPopup && (
        <VotePopup name={votedTo} onClose={() => setShowPopup(false)} />
      )}
      {showElectionEndedPopup && (
        <ElectionEndedPopup
          onClose={() => {
            setShowElectionEndedPopup(false);
            setElectionActive(false); // stop any refresh tied to live election
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
