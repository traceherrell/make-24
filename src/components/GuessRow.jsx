// src/components/GuessRow.js
import React from "react";
import "./GuessRow.css";
import { TARGET_NUMBER } from "../utils/make24Logic";

function GuessRow({ attemptData }) {
  // attemptData structure: { expression: string, result: number | string, status: 'correct' | 'incorrect' | 'error' | 'pending' | 'empty' }
  const { expression, result, status } = attemptData || { status: "empty" };

  let resultDisplay = "";
  if (status === "correct") {
    resultDisplay = `= ${TARGET_NUMBER}`;
  } else if (status === "incorrect" && typeof result === "number") {
    resultDisplay = `= ${result}`;
  } else if (status === "error") {
    resultDisplay = `Error`; // Keep it short, full error in message area
  }

  return (
    <div className={`guess-row ${status}`}>
      <span className="expression">{expression || ""}</span>
      <span className="result">{resultDisplay}</span>
    </div>
  );
}

export default GuessRow;
