import { useEffect, useState } from "react";
import "./BarBox.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// 🌈 New Color Palette
const COLORS = ["#4CAF50", "#FF5722", "#2196F3", "#9C27B0", "#FFC107"];

const WinnerPopup = ({ winnerName, onClose }) => (
  <div className="popup-overlay">
    <div className="popup-content">
      <h2>🎉 Winner</h2>
      <p>{winnerName}</p>
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  </div>
);

const BarBox = ({ result = [] }) => {
  const [showPopup, setShowPopup] = useState(false);

  // Handle safe defaults
  const maxVotes = result && result.length > 0 ? Math.max(...result.map(r => r.votes)) : 1;
  const sum = result && result.length > 0 ? result.reduce((acc, curr) => acc + curr.votes, 0) : 1;
  const winnerParty = result && result.length > 0 ? result[0]?.party : "";

  // Auto close popup after 1 min
  useEffect(() => {
    let timer;
    if (showPopup) timer = setTimeout(() => setShowPopup(false), 60000);
    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleWinner = () => setShowPopup(true);

  if (!result || result.length === 0) {
    return <div className="yellow-box">No data yet</div>;
  }

  return (
    <div className="results-card">
      {/* LEFT SECTION (Pie Chart) */}
      <div className="results-left">
        <ResponsiveContainer width={260} height={260}>
          <PieChart>
            <Pie
              data={result}
              dataKey="votes"
              nameKey="party"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              label
            >
              {result?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              align="center"
              wrapperStyle={{ fontSize: "14px", fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* CENTER SECTION (Bars) */}
      <div className="results-center">
        {result?.map((candidate, index) => {
          const widthPercent = maxVotes ? (candidate.votes / maxVotes) * 100 : 0;
          return (
            <div key={index} className="party-row">
              <span className="party-name">{candidate.party}</span>
              <div
                className="party-bar"
                style={{
                  width: `${widthPercent || 2}%`,
                  backgroundColor: COLORS[index % COLORS.length]
                }}
              >
                {((candidate.votes / sum) * 100).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT SECTION */}
      <div className="results-right">
        <button className="winner-btn" onClick={handleWinner}>
          <span className="star">★</span> Winner
        </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <WinnerPopup
          winnerName={winnerParty}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default BarBox;
