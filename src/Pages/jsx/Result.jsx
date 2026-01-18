
import React, { useEffect, useState } from "react";
import "../CssPages/Result.css";
import ResultCharts from "../../components/ResultCharts";

const ElectionResults = () => {
  const [results, setResults] = useState({
    headBoyResults: [],
    headGirlResults: [],
  });
  const [loading, setLoading] = useState(true);
 const [activeCategory, setActiveCategory] = useState("Head Boy");
  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await fetch(
          "https://voteverse-backend-deploy.onrender.com/election/history"
        );
        const data = await response.json();
        if(data.length === 0){
          setLoading(false);
          return;
        }
        console.log("Results data:", data[0]);
        setResults({
          headBoyResults: data[0].finalResults.headBoyResults || [],
          headGirlResults: data[0].finalResults.headGirlResults || [],
        });
      } catch (err) {
        console.error(err);
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
        </div>
      ))}
    </section>
  );
};

export default ElectionResults;
