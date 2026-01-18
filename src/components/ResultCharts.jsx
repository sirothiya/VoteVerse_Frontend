import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import "./ResultCharts.css";

const ResultCharts = ({ results, title , category}) => {
  const data = results.map((r) => ({
    name: r.name,
    votes: r.votes,
  }));
  if (data.length === 0) {
  return (
    <div className="chart-wrapper result-board no-result-card">
      <div className="no-result-icon">📊</div>
      <p className="no-results">
        No result available for: <span>{category}</span>
      </p>
    </div>
  );
}

  return (
    <div className="chart-wrapper result-board">
      <h3 className="board-title">🏆 {title}</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={index === 0 ? "#facc15" : "#60a5fa"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultCharts;
