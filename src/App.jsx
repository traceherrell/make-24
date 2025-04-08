// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import "./App.css"; // Keep general App styles
import * as math from "mathjs";

import MessageArea from "./components/MessageArea";
import {
  generateSolvableNumbers,
  validateAndEvaluateExpression,
  MAX_ATTEMPTS,
  TARGET_NUMBER,
} from "./utils/make24Logic";

function App() {
  const [targetNumbers, setTargetNumbers] = useState([]);
  const [originalNumbers, setOriginalNumbers] = useState([]); // Store original numbers for reset functionality
  const [solution, setSolution] = useState(null); // Store one possible solution
  const [expression1, setExpression1] = useState([]);
  const [expression2, setExpression2] = useState([]);
  const [expression3, setExpression3] = useState([]); // Store all expressions entered by the user
  const [gameStatus, setGameStatus] = useState("loading"); // 'loading', 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success'
  const [history, setHistory] = useState([]); // Track history for undo functionality
  const [usedIndices, setUsedIndices] = useState([]); // Track indices of used number tiles

  // Initialize game function
  const initializeGame = useCallback(() => {
    setGameStatus("loading");
    setMessage("Generating new numbers...");
    setMessageType("info");
    setUsedIndices([]); // Reset used indices when initializing a new game

    // Simulate loading just for effect if generation is instant
    setTimeout(() => {
      const { numbers, solution: foundSolution } = generateSolvableNumbers();
      setTargetNumbers(numbers);
      setOriginalNumbers(numbers); // Store original numbers for reset functionality
      setSolution(foundSolution); // Store the solution

      setGameStatus("playing");
      setMessage("Enter an expression using the numbers to make 24.");
      setMessageType("info");
    }, 50); // Short delay
  }, []);

  // Run initialization on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Reset game function
  const resetGame = () => {
    setTargetNumbers(originalNumbers); // Reset to original numbers
    setExpression1([]);
    setExpression2([]);
    setExpression3([]);
    setUsedIndices([]); // Reset used indices
    setHistory([]); // Clear history
  };

  const newGame = () => {
    resetGame(); // Reset game state
    initializeGame(); // Start a new game
  };

  const onNumClick = (e, index) => {
    // If it's an operator, allow it to be clicked multiple times
    const isOperator = ["+", "-", "*", "/"].includes(e.target.innerText);

    // If not an operator and the index is already used, ignore the click
    if (!isOperator && usedIndices.includes(index)) {
      return;
    }

    const number = e.target.innerText;
    setHistory((prev) => [
      ...prev,
      {
        targetNumbers,
        expression1,
        expression2,
        expression3,
        usedIndices, // Also store used indices in history for undo
      },
    ]); // Save current state to history

    // If it's not an operator, mark this index as used
    if (!isOperator) {
      setUsedIndices((prev) => [...prev, index]);
    }

    // Handle the click event, e.g., update state or perform an action
    console.log(`Number clicked: ${number}`);
    if (expression1.length < 3) {
      if (expression1.length === 2) {
        const currentExpression = [...expression1]; // Copy current expression
        currentExpression.push(number); // Append clicked number to expression
        console.log(currentExpression);
        const result = math.evaluate(currentExpression.join(""));
        setExpression1(currentExpression); // Append clicked number to expression

        // find the first index of the number in targetNumbers then swap it with the result
        const newTargetNumbers = [...targetNumbers]; // Copy target numbers
        const numIndex = newTargetNumbers.findIndex(
          (num) => num === Number(number)
        );
        newTargetNumbers[numIndex] = result; // Replace clicked number with result

        // find the first index of the first number in expression1
        const firstIndex = newTargetNumbers.findIndex(
          (num) => num === Number(expression1[0])
        );
        //remove the index from targetNumbers
        newTargetNumbers.splice(firstIndex, 1); // Remove the first number in expression1 from target numbers

        setTargetNumbers(newTargetNumbers); // Update target numbers
        // clear used indices
        setUsedIndices([]); // Reset used indices after using a number
        return;
      }
      setExpression1((prev) => [...prev, number]); // Append clicked number to expression
      return;
    }
    // ... Rest of the function remains the same
    if (expression2.length < 3) {
      if (expression2.length === 2) {
        const currentExpression = [...expression2]; // Copy current expression
        currentExpression.push(number); // Append clicked number to expression
        console.log(currentExpression);
        const result = math.evaluate(currentExpression.join(""));
        setExpression2(currentExpression); // Append clicked number to expression

        // find the first index of the number in targetNumbers then swap it with the result
        const newTargetNumbers = [...targetNumbers]; // Copy target numbers
        const numIndex = newTargetNumbers.findIndex(
          (num) => num === Number(number)
        );
        newTargetNumbers[numIndex] = result; // Replace clicked number with result

        // find the first index of the first number in expression1
        const firstIndex = newTargetNumbers.findIndex(
          (num) => num === Number(expression2[0])
        );
        //remove the index from targetNumbers
        newTargetNumbers.splice(firstIndex, 1); // Remove the first number in expression1 from target numbers

        setTargetNumbers(newTargetNumbers); // Update target numbers
        setUsedIndices([]); // Reset used indices after using a number
        return;
      }

      setExpression2((prev) => [...prev, number]); // Append clicked number to expression
      return;
    }
    if (expression3.length < 3) {
      if (expression3.length === 2) {
        const currentExpression = [...expression3]; // Copy current expression
        currentExpression.push(number); // Append clicked number to expression
        console.log(currentExpression);
        const result = math.evaluate(currentExpression.join(""));
        setExpression3(currentExpression); // Append clicked number to expression
        // find the first index of the number in targetNumbers then swap it with the result
        const newTargetNumbers = [...targetNumbers]; // Copy target numbers
        const numIndex = newTargetNumbers.findIndex(
          (num) => num === Number(number)
        );
        newTargetNumbers[numIndex] = result; // Replace clicked number with result

        // find the first index of the first number in expression3
        const firstIndex = newTargetNumbers.findIndex(
          (num) => num === Number(expression3[0])
        );
        //remove the index from targetNumbers
        newTargetNumbers.splice(firstIndex, 1); // Remove the first number in expression3 from target numbers

        setTargetNumbers(newTargetNumbers); // Update target numbers

        if (result === 24) {
          setMessage("You found a solution!"); // Update message
        } else {
          setMessage("Not a solution yet! Keep trying."); // Update message
        }
        return;
      }

      setExpression3((prev) => [...prev, number]); // Append clicked number to expression
      return;
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setTargetNumbers(lastState.targetNumbers);
      setExpression1(lastState.expression1);
      setExpression2(lastState.expression2);
      setExpression3(lastState.expression3);
      setUsedIndices(lastState.usedIndices || []); // Restore used indices state
      setHistory((prev) => prev.slice(0, -1)); // Remove the last state from history
    }
  };

  return (
    <div className="App">
      {gameStatus !== "loading" && (
        <>
          <MessageArea message={message} type={messageType} />
          <div className="number-display">
            <h2>Your Numbers: {originalNumbers.join(",")}</h2>
            <div className="numbers-container">
              {targetNumbers?.map((num, index) => (
                <span
                  onClick={(e) => onNumClick(e, index)}
                  key={index}
                  className={`number-tile ${
                    usedIndices.includes(index) ? "used" : ""
                  } ${num === 24 ? "success" : ""}`}
                >
                  {num}
                </span>
              ))}
            </div>

            <h2>Operators:</h2>
            <div className="numbers-container">
              {["+", "-", "*", "/"].map((op, index) => (
                <span
                  onClick={(e) => onNumClick(e, "op-" + index)}
                  key={"op-" + index}
                  className="number-tile operator"
                >
                  {op}
                </span>
              ))}
            </div>
          </div>
          <div className="row">
            <button onClick={handleUndo} disabled={history.length === 0}>
              <span className="material-icons">history</span>
            </button>

            <button onClick={resetGame}>
              <span className="material-icons">restart_alt</span>
            </button>
            <button onClick={newGame}>
              <span className="material-icons">refresh</span>
            </button>
          </div>

          <div>
            <h2>Expressions:</h2>
            <div>
              {expression1?.map((num, index) => (
                <span key={index}>{num}</span>
              ))}

              {expression1.length > 2
                ? " = " + math.evaluate(expression1.join(""))
                : ""}
            </div>
            <div>
              {expression2?.map((num, index) => (
                <span key={index}>{num}</span>
              ))}

              {expression2.length > 2
                ? " = " + math.evaluate(expression2.join(""))
                : ""}
            </div>
            <div>
              {expression3?.map((num, index) => (
                <span key={index}>{num}</span>
              ))}

              {expression3.length > 2
                ? " = " + math.evaluate(expression3.join(""))
                : ""}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
