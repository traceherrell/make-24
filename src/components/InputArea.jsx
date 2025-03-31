// src/components/InputArea.js
import React, { useState, useEffect } from "react";
import "./InputArea.css";

function InputArea({ onSubmit, disabled }) {
  const [expression, setExpression] = useState("");
  const [lastExpression, setLastExpression] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expression.trim() && !disabled) {
      onSubmit(expression);
      setLastExpression(expression); // Save the expression before clearing
      setExpression(""); // Clear input after submit
    }
  };

  const handleKeyDown = (e) => {
    // If up arrow is pressed and we have a last expression
    if (e.key === "ArrowUp" && lastExpression) {
      e.preventDefault(); // Prevent default cursor movement
      setExpression(lastExpression);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-area">
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter expression (e.g., (a+b)*(c/d))"
        disabled={disabled}
        aria-label="Enter your expression"
        autoFocus
      />
      <button type="submit" disabled={disabled || !expression.trim()}>
        Submit
      </button>
    </form>
  );
}

export default InputArea;
