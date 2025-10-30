import React, { useEffect, useState } from "react";
import "../CssPages/Result.css";
import { useNavigate } from "react-router-dom";
import BarBox from "../../components/BarBox";

const ElectionResults = ({ setPage }) => {
  const [result, setResult] = useState([]);
  const [resultAvailable, setResultAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCount = async () => {
      try {
        const response = await fetch(
          "https://voteverse-backend.onrender.com/admin/vote/count",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setResult(data.voteRecord?.sort((a, b) => b.votes - a.votes));
        setResultAvailable(
          data.voteRecord?.some((candidate) => candidate.votes > 0)
        );
      } catch (err) {
        console.log(err);
      }
    };
    handleCount();
  }, []);

  const handleback = () => {
    setPage("dashboard");
  };

  const handleStop = async () => {
    const token = localStorage.getItem("token");
    try {
      const response_candidate = await fetch(
        "https://voteverse-backend.onrender.com/admin/delete/all",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("All data deleted", await response_candidate.json());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Election stopped successfully");
    } catch (err) {
      console.log("Error in stopping election", err);
      alert("Error in stopping election");
    }
  };

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <h2>Election Result</h2>
      </div>

      {/* Dynamic Bar Graph */}
      <BarBox result={resultAvailable ? result : []} />

      {/* Candidate List */}
      <div className="candidate-list">
        {resultAvailable
          ? result?.map((r, index) => (
              <div key={index} className="candidate-row">
                <span>{r.party}</span>
                <span>{r.votes} votes</span>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default ElectionResults;
