
import React, { useEffect, useState } from "react";
import "../CssPages/Result.css";
import ResultCharts from "../../components/ResultCharts";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../components/AlertModal";

const ElectionResults = () => {
  const [results, setResults] = useState({
    headBoyResults: [],
    headGirlResults: [],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
 const [activeCategory, setActiveCategory] = useState("Head Boy");
  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await fetch(
          "https://voteverse-backend-new.onrender.com/election/history"
        );
        const data = await response.json();
        if(data.length === 0){
          setLoading(false);
          return;
        }
        setResults({
          headBoyResults: data[0].finalResults.headBoyResults || [],
          headGirlResults: data[0].finalResults.headGirlResults || [],
        });
      } catch (err) {
       setErrorMsg("Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) return <p className="result-loading">Loading results...</p>;
  return (
      <div className="modal">
         <div className="chart-tabs">
          {["Head Girl", "Head Boy"].map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? "active" : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <AlertModal message={errorMsg} onClose={() => setErrorMsg("")} duration={3000} />
        <ResultCharts
          results={
            activeCategory === "Head Boy"
              ? results.headBoyResults
              : results.headGirlResults
          }
          title={`${activeCategory} Vote Distribution`}
          category={activeCategory}
        />
        <ResultSection title="Final Results" results={ activeCategory === "Head Boy"
              ? results.headBoyResults
              : results.headGirlResults
          }/>
        
      </div>
   
  );
};

const ResultSection = ({ title, results = [] }) => {
  const navigate= useNavigate()
  if (!results.length) return null;
  return (
    <section className="result-section">
      <h3>{title}</h3>

      {results.map((r, i) => (
        <div
          key={r.candidateId}
          className={`result-card ${i === 0 ? "winner" : "runner"}`}
        >
          <span className="rank">{i === 0 ? "🥇 Winner" : "🥈 Runner-up"}</span>
          <span className="name">{r.name}</span>
          <span className="votes">{r.votes} votes</span>
          <button className="profile" onClick={() =>( navigate(`/candidateDetails/${r.rollNumber}`))}>View Profile</button>
        </div>
      ))}
    </section>
  );
};

export default ElectionResults;
