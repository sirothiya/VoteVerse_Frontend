
import React, { useEffect, useState } from "react";
import "./Countdown.css";

export default function CountDown({ startTime, endTime, onExpire, compact}) {
  const [status, setStatus] = useState("loading"); // before | running | ended
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!startTime || !endTime) return;

    let expired = false;
    const tick = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) {
        setStatus("before");
        setTimeLeft(toObj(start - now));
        return;
      }

      if (now >= start && now < end) {
        setStatus("running");
        setTimeLeft(toObj(end - now));
        return;
      }

      // ended
      setStatus("ended");
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      if (!expired) {
        expired = true;
        onExpire && onExpire();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime, endTime, onExpire]);

  return (
    <div className={`countdown-container ${compact ? "compact" : ""}`}>
      {status === "before" && <h2 className="status before">Election Starts In</h2>}
      {status === "running" && <h2 className="status running">Election Ends In</h2>}
      {status === "ended" && <h2 className="status ended">Election Has Ended</h2>}

      {status !== "ended" && (
        <div className="timer">
          <div><span>{timeLeft.days}</span><p>Days</p></div>
          <div><span>{timeLeft.hours}</span><p>Hrs</p></div>
          <div><span>{timeLeft.minutes}</span><p>Min</p></div>
          <div><span>{timeLeft.seconds}</span><p>Sec</p></div>
        </div>
      )}
    </div>
  );
}

function toObj(ms) {
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / (3600 * 24)),
    hours: Math.floor((total % (3600 * 24)) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
