import { useNavigate, useParams } from "react-router-dom";
import "../CssPages/ProfilePage.css";
import { useEffect, useState } from "react";
import ElectionResults from "./Result";
import Dropdown from "../../components/Dropdown";
import CountDown from "../../components/CountDown";

// 🎉 Vote success popup
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

// 🏁 Election ended popup
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [candidateData, setCandidateData] = useState([]);
  const [electionActive, setElectionActive] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [votedTo, setVotedTo] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showElectionEndedPopup, setShowElectionEndedPopup] = useState(false);
  const [announcements, setAnnouncements] = useState([
    "Voting closes on Oct 10, 6 PM.",
    "Results will be declared on Oct 11, 12 PM.",
  ]);
  const { rollNumber } = useParams();
  // 🔹 Load election + candidate data
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    setToken(storedToken);

    const getUser = async () => {
      try {
        const res = await fetch(
          `https://voteverse-backend.onrender.com/user/profile/${rollNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Cache-Control": "no-cache",
            },
          }
        );
         console.log("check1")
        const data = await res.json();
         console.log("check2 :", data.user)
         if (!res.ok) throw new Error("Failed to fetch user profile");
         console.log("check3")
        setUser(data.user);
        console.log("userData:",data.user)
      } catch (err) {
        console.error(err);
        alert("Error in getting voter profile");
      }
    };

    const getData = async () => {
      try {
        const electionRes = await fetch(
          "https://voteverse-backend.onrender.com/election/status"
        );
        const electionData = await electionRes.json();
        setElectionActive(electionData);

        if (!electionData.isActive) {
          setCandidateData([]);
          setShowResults(true);
          if (!localStorage.getItem("electionEndedShown")) {
            setShowElectionEndedPopup(true);
            localStorage.setItem("electionEndedShown", "true");
          }
          return;
        }

        const candidateRes = await fetch(
          "https://voteverse-backend.onrender.com/admin/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        const candidateData = await candidateRes.json();
        setCandidateData(candidateData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await getUser();
      // await getData();
      setLoading(false);
    };

    fetchAll();
  }, [rollNumber]);

  // 🗳️ Cast Vote
  const handleVote = async (id, name) => {
    setShowPopup(true);
    setVotedTo(name);
    try {
      const res = await fetch(
        `https://voteverse-backend.onrender.com/election/vote/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) return alert("Error casting vote");

      const updatedUser = { ...user, isVoted: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  // ❌ Delete Account
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(
        "https://voteverse-backend.onrender.com/user/deleteOne",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return alert("Error deleting account");

      alert("Account Deleted Successfully");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  // 🕒 End Election
  const handleExpire = async () => {
    try {
      if (!electionActive) return;

      await fetch(
        `https://voteverse-backend.onrender.com/election/stop/${electionActive._id}`
      );
      const deleteRes = await fetch(
        "https://voteverse-backend.onrender.com/admin/delete/all",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (deleteRes.ok) setCandidateData([]);

      const statusRes = await fetch(
        "https://voteverse-backend.onrender.com/election/status"
      );
      const statusData = await statusRes.json();
      setElectionActive(statusData);

      setShowResults(true);
      localStorage.removeItem("electionEndedShown");
      setShowElectionEndedPopup(true);
    } catch (err) {
      console.error("Error ending election:", err);
    }
  };

  // 🚀 Render

  if (loading) {
    return (
      <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <div className="spinner"></div>
          <p style={{ marginTop: "10px", fontSize: "18px", color: "#555" }}>
          Loading candidate details...
          </p>
        </div>
    );
  }
  return (
    <div className="profile-container">
      <section>
      <h1 className="title">Welcome!! {user? user.name :"Voter"}</h1>
      <div className="side-by-side">
        <p>🗳️ Voting Status </p>
        <p>
          : {" "}
          <span className={user?.isVoted ? "voted" : "not-voted"}>
            {user?.isVoted ? "You have voted!" : "Not voted yet"}
          </span>
        </p>
      </div>
        
      </section>
      <div className="temp">
      <section className="card">
        <h2>📅 Election Timeline</h2>
        <div className="timeline">
          <div className="timeline-step completed">Voting Starts</div>
          <div
            className={`timeline-step ${
              electionActive?.isActive ? "active" : ""
            }`}
          >
            Voting Open
          </div>
          <div className={`timeline-step ${showResults ? "completed" : ""}`}>
            Voting Closed
          </div>
          <div className={`timeline-step ${showResults ? "active" : ""}`}>
            Results Declared
          </div>
        </div>
      </section>
      <section className="card">
        <h2>📜 Announcements</h2>
        <ul>
          {announcements.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </section>
      </div>
     {/* 🕒 Countdown Timer */}
      {!showResults && electionActive?.isActive && (
        <CountDown
          startTime={electionActive.startTime}
          endTime={electionActive.endTime}
          onExpire={handleExpire}
        />
      )}
      <section className="card">
        <h2>🕒 Active Elections</h2>
        {!showResults ? (
          <div className="elections-grid">
            {candidateData?.length > 0 ? (
              candidateData.map((c) => (
                <div key={c.id} className="election-card">
                  <h3>{c.name}</h3>
                  <p>{c.party}</p>
                  {c.partySymbol && (
                    <img
                      src={`https://voteverse-backend.onrender.com/${c.partySymbol.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={`${c.party} Symbol`}
                      className="party-symbol"
                    />
                  )}
                  {!user?.isVoted && electionActive?.isActive && (
                    <button
                      className="vote-btn"
                      onClick={() => handleVote(c.id, c.name)}
                    >
                      Vote Now
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No active candidates found.</p>
            )}
          </div>
        ) : (
          <ElectionResults />
        )}
      </section>

      {/* 🏆 Results */}
      {showResults && (
        <section className="card">
          <h2>🏆 Results Summary</h2>
          <ElectionResults />
        </section>
      )}
      {/* Popups */}
      {showPopup && (
        <VotePopup name={votedTo} onClose={() => setShowPopup(false)} />
      )}
      {showElectionEndedPopup && (
        <ElectionEndedPopup onClose={() => setShowElectionEndedPopup(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
