// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import "./App.css"; // Keep general App styles
import NumberDisplay from "./components/NumberDisplay";
import GameBoard from "./components/GameBoard";
import InputArea from "./components/InputArea";
import MessageArea from "./components/MessageArea";
import {
  generateSolvableNumbers,
  validateAndEvaluateExpression,
  MAX_ATTEMPTS,
  TARGET_NUMBER,
} from "./utils/make24Logic";

function App() {
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [solution, setSolution] = useState(null); // Store one possible solution
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(null));
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [gameStatus, setGameStatus] = useState("loading"); // 'loading', 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success'

  // Initialize game function
  const initializeGame = useCallback(() => {
    setGameStatus("loading");
    setMessage("Generating new numbers...");
    setMessageType("info");

    // Simulate loading just for effect if generation is instant
    setTimeout(() => {
      const { numbers, solution: foundSolution } = generateSolvableNumbers();
      setTargetNumbers(numbers);
      setSolution(foundSolution); // Store the solution
      setGuesses(Array(MAX_ATTEMPTS).fill(null));
      setCurrentAttempt(0);
      setGameStatus("playing");
      setMessage("Enter an expression using the numbers above to make 24.");
      setMessageType("info");
    }, 50); // Short delay
  }, []);

  // Run initialization on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle expression submission
  const handleSubmitExpression = useCallback(
    (expression) => {
      if (gameStatus !== "playing") return;

      const { valid, error, result } = validateAndEvaluateExpression(
        expression,
        targetNumbers
      );

      const newGuesses = [...guesses];
      let attemptStatus = "error"; // Default to error
      let feedbackMessage = error || ""; // Use error message from validation
      let feedbackType = "error";

      if (valid) {
        if (result === TARGET_NUMBER) {
          attemptStatus = "correct";
          setGameStatus("won");
          feedbackMessage = `Correct! ${expression} = ${TARGET_NUMBER}. You won!`;
          feedbackType = "success";
        } else {
          attemptStatus = "incorrect";
          feedbackMessage = `Your expression ${expression} = ${result}. Try again!`;
          feedbackType = "info"; // Or 'error' if you prefer red for incorrect results
        }
      }
      // If not valid, error message is already set from validation

      newGuesses[currentAttempt] = {
        expression,
        result: error ? null : result,
        status: attemptStatus,
      };
      setGuesses(newGuesses);
      setMessage(feedbackMessage);
      setMessageType(feedbackType);

      // Only advance attempt if the submission wasn't immediately rejected (e.g., syntax error before calc)
      // Or always advance attempt? Let's always advance attempt on submit button click.
      const nextAttempt = currentAttempt + 1;

      if (attemptStatus !== "correct" && nextAttempt >= MAX_ATTEMPTS) {
        setGameStatus("lost");
        setMessage(
          `Out of attempts! The target was ${TARGET_NUMBER}. A possible solution: ${
            solution || "Could not find one"
          }`
        );
        setMessageType("error");
      } else if (attemptStatus !== "correct") {
        setCurrentAttempt(nextAttempt);
        // Keep the feedback message from the attempt
      } else {
        setCurrentAttempt(nextAttempt); // Advance even on win to show final row correctly
      }
    },
    [currentAttempt, gameStatus, guesses, targetNumbers, solution]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Make 24</h1>
      </header>

      {gameStatus !== "loading" && (
        <>
          <NumberDisplay numbers={targetNumbers} />
          <MessageArea message={message} type={messageType} />
          <GameBoard guesses={guesses} />
          <InputArea
            onSubmit={handleSubmitExpression}
            disabled={gameStatus !== "playing"}
          />
          {(gameStatus === "won" || gameStatus === "lost") && (
            <button onClick={initializeGame} className="play-again-button">
              Play Again?
            </button>
          )}
        </>
      )}
      {gameStatus === "loading" && (
        <MessageArea message={message} type={messageType} />
      )}
    </div>
  );
}

export default App;
