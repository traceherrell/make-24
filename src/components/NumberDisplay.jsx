// src/components/NumberDisplay.js
import React from "react";
import "./NumberDisplay.css";

function NumberDisplay({ numbers }) {
  return (
    <div className="number-display">
      <h2>Your Numbers:</h2>
      <div className="numbers-container">
        {numbers.map((num, index) => (
          <span key={index} className="number-tile">
            {num}
          </span>
        ))}
      </div>
    </div>
  );
}

export default NumberDisplay;
