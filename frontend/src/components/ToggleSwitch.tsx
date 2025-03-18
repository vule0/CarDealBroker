import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  selected: "consultation" | "lease" | "sell";
  onChange: (value: "consultation" | "lease" | "sell") => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ selected, onChange }) => {
  return (
    <div className="toggle">
      <div className="btn-container">
        <div className="triple-toggle">
          <button
            className={`toggle-btn ${selected === "consultation" ? "active" : ""}`}
            onClick={() => onChange("consultation")}
          >
            CONSULTATION
          </button>
          <button
            className={`toggle-btn ${selected === "lease" ? "active" : ""}`}
            onClick={() => onChange("lease")}
          >
            LEASE
          </button>
          <button
            className={`toggle-btn ${selected === "sell" ? "active" : ""}`}
            onClick={() => onChange("sell")}
          >
            SELL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
