// src/components/GameBoard.js
import React from "react";
import GuessRow from "./GuessRow";
import { MAX_ATTEMPTS } from "../utils/make24Logic";
import "./GameBoard.css";

function GameBoard({ guesses }) {
  const rows = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    rows.push(<GuessRow key={i} attemptData={guesses[i]} />);
  }

  return <div className="game-board">{rows}</div>;
}

export default GameBoard;
