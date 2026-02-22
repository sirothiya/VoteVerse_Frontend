import React, { useState } from "react";
import "./VotingTour.css";

const steps = [
  "Login using your school ID and password.",
  "Choose a category: Head Boy or Head Girl.",
  "Click on a candidate to view full details.",
  "Vote button activates only during election time.",
  "Results appear after election ends. Do refresh and Please wait.",
  "View past elections using 'Show Results'.",
];

const VotingTour = ({ onClose }) => {
  const [step, setStep] = useState(0);

  return (
    <div className="tour-overlay">
      <div className="tour-box">
        <div className="tour-header">
          <h3>🧭 Voting Guide</h3>
          <button className="tour-skip" onClick={onClose}>
            Skip ✖
          </button>
        </div>

        <div className="tour-content">
          <div className="tour-step">
            Step {step + 1} of {steps.length}
          </div>
          <p>{steps[step]}</p>
        </div>

        <div className="tour-actions">
          <button
            className="tour-btn secondary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              className="tour-btn primary"
              onClick={() => setStep(step + 1)}
            >
              Next →
            </button>
          ) : (
            <button className="tour-btn primary" onClick={onClose}>
              Finish ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingTour;
