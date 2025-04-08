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
  const [solution, setSolution] = useState(null); // Store one possible solution
  const [expression1, setExpression1] = useState([]);
  const [expression2, setExpression2] = useState([]);
  const [expression3, setExpression3] = useState([]); // Store all expressions entered by the user
  const [gameStatus, setGameStatus] = useState("loading"); // 'loading', 'playing', 'won', 'lost'
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // 'info', 'error', 'success'
  const [history, setHistory] = useState([]); // Track history for undo functionality

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

      setGameStatus("playing");
      setMessage("Enter an expression using the numbers above to make 24.");
      setMessageType("info");
    }, 50); // Short delay
  }, []);

  // Run initialization on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  const onNumClick = (e) => {
    const number = e.target.innerText;
    setHistory((prev) => [
      ...prev,
      { targetNumbers, expression1, expression2, expression3 },
    ]); // Save current state to history

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
        const index = newTargetNumbers.findIndex(
          (num) => num === Number(number)
        );
        newTargetNumbers[index] = result; // Replace clicked number with result

        // find the first index of the first number in expression1
        const firstIndex = newTargetNumbers.findIndex(
          (num) => num === Number(expression1[0])
        );
        //remove the index from targetNumbers
        newTargetNumbers.splice(firstIndex, 1); // Remove the first number in expression1 from target numbers

        setTargetNumbers(newTargetNumbers); // Update target numbers
        return;
      }
      setExpression1((prev) => [...prev, number]); // Append clicked number to expression
      return;
    }
    if (expression2.length < 3) {
      if (expression2.length === 2) {
        const currentExpression = [...expression2]; // Copy current expression
        currentExpression.push(number); // Append clicked number to expression
        console.log(currentExpression);
        const result = math.evaluate(currentExpression.join(""));
        setExpression2(currentExpression); // Append clicked number to expression

        // find the first index of the number in targetNumbers then swap it with the result
        const newTargetNumbers = [...targetNumbers]; // Copy target numbers
        const index = newTargetNumbers.findIndex(
          (num) => num === Number(number)
        );
        newTargetNumbers[index] = result; // Replace clicked number with result

        // find the first index of the first number in expression1
        const firstIndex = newTargetNumbers.findIndex(
          (num) => num === Number(expression2[0])
        );
        //remove the index from targetNumbers
        newTargetNumbers.splice(firstIndex, 1); // Remove the first number in expression1 from target numbers

        setTargetNumbers(newTargetNumbers); // Update target numbers
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
        const index = newTargetNumbers.findIndex(
          (num) => num === Number(number)
        );
        newTargetNumbers[index] = result; // Replace clicked number with result

        // find the first index of the first number in expression3
        const firstIndex = newTargetNumbers.findIndex(
          (num) => num === Number(expression3[0])
        );
        //remove the index from targetNumbers
        newTargetNumbers.splice(firstIndex, 1); // Remove the first number in expression3 from target numbers

        setTargetNumbers(newTargetNumbers); // Update target numbers

        if (result === 24) {
          setMessage("You found a solution!"); // Update message
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
      setHistory((prev) => prev.slice(0, -1)); // Remove the last state from history
    }
  };

  return (
    <div className="App">
      {gameStatus !== "loading" && (
        <>
          <MessageArea message={message} type={messageType} />
          <div className="number-display">
            <h2>Your Numbers:</h2>
            <div className="numbers-container">
              {targetNumbers?.map((num, index) => (
                <span onClick={onNumClick} key={index} className="number-tile">
                  {num}
                </span>
              ))}
            </div>

            <h2>Operators:</h2>
            <div className="numbers-container">
              {["+", "-", "*", "/"].map((num, index) => (
                <span onClick={onNumClick} key={index} className="number-tile">
                  {num}
                </span>
              ))}
            </div>
          </div>
          <button
            className="modern-undo"
            onClick={handleUndo}
            disabled={history.length === 0}
          >
            {"<-"}
          </button>
          <div>
            <h2>Expressions:</h2>
            <div>
              {expression1?.map((num, index) => (
                <span key={index}>{num}</span>
              ))}
              <span> = </span>
              {expression1.length > 2
                ? math.evaluate(expression1.join(""))
                : ""}
            </div>
            <div>
              {expression2?.map((num, index) => (
                <span key={index}>{num}</span>
              ))}
              <span> = </span>
              {expression2.length > 2
                ? math.evaluate(expression2.join(""))
                : ""}
            </div>
            <div>
              {expression3?.map((num, index) => (
                <span key={index}>{num}</span>
              ))}
              <span> = </span>
              {expression3.length > 2
                ? math.evaluate(expression3.join(""))
                : ""}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
