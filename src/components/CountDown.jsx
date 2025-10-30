import { useEffect, useState } from 'react';

const StatusPopup = ({ message, onClose }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <h2> {message} </h2>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

function CountDown({ startTime, endTime ,onExpire}) {
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState(""); // "notStarted" | "running" | "ended"
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!endTime || !startTime) return;

    const start = new Date(startTime);
    const end = new Date(endTime);
    let expiredAlready = false; // to ensure onExpire is called only once
    const updateTime = () => {
      const now = new Date();

      if (now < start) {
        // Election has not started yet
        setStatus("notStarted");
        setTimeLeft("Election Not Started Yet");
        return;
      }

      if (now >= start && now < end) {
        // Running
        const diff = end - now;
        const Days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setStatus("running");
        setTimeLeft(`${Days}d ${hours}hr ${minutes}min ${seconds}sec`);
        return;
      }

      if (now >= end) {
        // Ended
        setStatus("ended");
        setTimeLeft("Election Ended");
         if (!expiredAlready && onExpire) {
          expiredAlready = true;
          onExpire(); // call backend to mark ended
        }
        return;
      }
    };

    // run once immediately
    updateTime();

    // update every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // Popups logic
  useEffect(() => {
    if (status === "notStarted") {
      setShowPopup(true);
    } else if (status === "ended") {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [status]);

  return (
    <div>
      <p className="countdown-timer">{timeLeft}</p>
      {showPopup && status === "notStarted" && (
        <StatusPopup message="Election Not Started Yet" onClose={() => setShowPopup(false)} />
      )}
      {showPopup && status === "ended" && (
        <StatusPopup message="🎉 Election Ended" onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default CountDown;
