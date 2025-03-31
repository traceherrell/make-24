// src/utils/make24Logic.js
import * as math from "mathjs"; // Import the whole library

export const TARGET_NUMBER = 24;
export const NUM_COUNT = 4;
export const MAX_ATTEMPTS = 6;

// --- Solver Logic (Simplified - handles basic ops and permutations) ---

const operators = ["+", "-", "*", "/"];

// Generates all possible expressions for a given permutation of numbers
// This is a simplified solver and might not find all possible solutions,
// especially complex ones involving multiple parentheses layers, but covers common cases.
function* generateExpressions(nums) {
  if (nums.length === 1) {
    yield nums[0].toString();
    return;
  }

  for (let i = 1; i < nums.length; i++) {
    const leftSub = nums.slice(0, i);
    const rightSub = nums.slice(i);

    for (const leftExpr of generateExpressions(leftSub)) {
      for (const rightExpr of generateExpressions(rightSub)) {
        for (const op of operators) {
          // Format 1: (Left) op (Right)
          yield `(${leftExpr}) ${op} (${rightExpr})`;
          // Format 2: Left op Right (less necessary with outer loop permutations)
          // but handles cases like a * (b + c + d) implicitly
          if (leftSub.length === 1 || rightSub.length === 1) {
            yield `${leftExpr} ${op} ${rightExpr}`; // Avoid redundant parens like (a) + (b)
          }
        }
      }
    }
  }
}

function permute(permutation) {
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k,
    p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

// Finds *one* solution for the given numbers, or null if none found by the generator
function findSolution(targetNums) {
  console.log("nums:", targetNums);
  const numbersArray = Array.isArray(targetNums)
    ? targetNums
    : Array.from(targetNums);
  // Use our own permutation function instead of math.permutations
  const numPermutations = permute(numbersArray);

  for (const p of numPermutations) {
    for (const expr of generateExpressions(p)) {
      try {
        // Use math.evaluate here too for consistency if needed
        if (Math.abs(math.evaluate(expr) - TARGET_NUMBER) < 1e-10) {
          return expr;
        }
      } catch (e) {
        // ignore errors
      }
    }
  }
  return null;
}

// --- Game Setup ---

export function generateSolvableNumbers() {
  let attempts = 0;
  while (attempts < 100) {
    // Limit attempts to avoid infinite loops
    const numbers = Array.from(
      { length: NUM_COUNT },
      () => Math.floor(Math.random() * 9) + 1
    ); // Digits 1-9
    const solution = findSolution(numbers);
    if (solution) {
      console.log(
        `Generated: ${numbers.join(", ")}. Found solution: ${solution}`
      ); // For debugging
      return { numbers, solution };
    }
    attempts++;
  }
  // Fallback if no solvable set found quickly (rare with 1-9)
  console.warn(
    "Could not find a solvable set quickly, using default [1, 2, 3, 4]"
  );
  return {
    numbers: [1, 2, 3, 4],
    solution: findSolution([1, 2, 3, 4]) || "(3 + 1) * (4 + 2)",
  }; // Default
}

// --- Input Validation & Evaluation ---

// Extracts numbers from an expression string
function extractNumbers(expression) {
  return (expression.match(/\d+/g) || []).map(Number);
}

// Checks if two arrays contain the same numbers (regardless of order)
function haveSameNumbers(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);
  return sorted1.every((val, index) => val === sorted2[index]);
}

export function validateAndEvaluateExpression(expression, targetNumbers) {
  // 1. Basic Syntax Check (mathjs handles most) & Number Usage Check
  const usedNumbers = extractNumbers(expression);

  if (!haveSameNumbers(usedNumbers, targetNumbers)) {
    const targetStr = targetNumbers.join(", ");
    const usedStr = usedNumbers.length > 0 ? usedNumbers.join(", ") : "none";
    return {
      valid: false,
      error: `Must use numbers ${targetStr} exactly once. You used: ${usedStr}.`,
      result: null,
    };
  }

  // 2. Evaluate using mathjs
  try {
    const result = math.evaluate(expression);
    // Format result nicely (handles potential floating point inaccuracies for simple cases)
    const formattedResult = math.format(result, { precision: 10 }); // Avoid 23.999999999999996

    // Check if result is acceptably close to TARGET_NUMBER
    if (Math.abs(result - TARGET_NUMBER) < 1e-9) {
      return { valid: true, error: null, result: TARGET_NUMBER }; // Snap to target if close
    }

    return { valid: true, error: null, result: Number(formattedResult) }; // Return the actual calculated result
  } catch (e) {
    // Catch errors from mathjs (SyntaxError, etc.)
    let errorMessage = "Invalid mathematical expression.";
    if (e instanceof Error) {
      errorMessage = e.message.split("\n")[0]; // Get the first line of mathjs error
      if (errorMessage.includes("Division by zero")) {
        errorMessage = "Division by zero is not allowed.";
      } else {
        errorMessage = `Syntax Error: ${errorMessage}`;
      }
    }
    return { valid: false, error: errorMessage, result: null };
  }
}
