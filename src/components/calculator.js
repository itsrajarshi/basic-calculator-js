import React, { useState, useCallback } from "react";
import styles from "./Calculator.module.css";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [operator, setOperator] = useState(null);

  // Memoized calculation function
  const calculate = useCallback((firstOperand, secondOperand, operator) => {
    switch (operator) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "*":
        return firstOperand * secondOperand;
      case "/":
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }, []);

  const inputDigit = useCallback(
    (digit) => {
      if (waitingForSecondOperand) {
        setDisplay(digit);
        setWaitingForSecondOperand(false);
      } else {
        setDisplay(display === "0" ? digit : display + digit);
      }
    },
    [waitingForSecondOperand, display]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [waitingForSecondOperand, display]);

  const clearDisplay = useCallback(() => {
    setDisplay("0");
    setFirstOperand(null);
    setWaitingForSecondOperand(false);
    setOperator(null);
  }, []);

  const performOperation = useCallback(
    (nextOperator) => {
      const inputValue = parseFloat(display);

      if (firstOperand === null) {
        setFirstOperand(inputValue);
      } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        setDisplay(String(result));
        setFirstOperand(result);
      }

      setWaitingForSecondOperand(true);
      setOperator(nextOperator);
    },
    [firstOperand, operator, display, calculate]
  );

  const handleEquals = useCallback(() => {
    if (operator === null || waitingForSecondOperand) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(result);
    setWaitingForSecondOperand(true);
    setOperator(null);
  }, [operator, waitingForSecondOperand, display, firstOperand, calculate]);

  const handleKeyPress = useCallback(
    (event) => {
      const { key } = event;
      if (/\d/.test(key)) {
        inputDigit(key);
      } else if (key === ".") {
        inputDecimal();
      } else if (key === "Enter" || key === "=") {
        handleEquals();
      } else if (key === "Escape") {
        clearDisplay();
      } else if (["+", "-", "*", "/"].includes(key)) {
        performOperation(key === "*" ? "*" : key);
      }
    },
    [inputDigit, inputDecimal, handleEquals, clearDisplay, performOperation]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const CalculatorButton = ({ className = "", value, onClick }) => (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      {value}
    </button>
  );

  return (
    <div className={styles.calculator}>
      <div className={styles.display}>{display}</div>
      <div className={styles.keypad}>
        <CalculatorButton
          className={styles.function}
          value="AC"
          onClick={clearDisplay}
        />
        <CalculatorButton className={styles.function} value="±" />
        <CalculatorButton className={styles.function} value="%" />
        <CalculatorButton
          className={styles.operator}
          value="÷"
          onClick={() => performOperation("/")}
        />

        <CalculatorButton value="7" onClick={() => inputDigit("7")} />
        <CalculatorButton value="8" onClick={() => inputDigit("8")} />
        <CalculatorButton value="9" onClick={() => inputDigit("9")} />
        <CalculatorButton
          className={styles.operator}
          value="×"
          onClick={() => performOperation("*")}
        />

        <CalculatorButton value="4" onClick={() => inputDigit("4")} />
        <CalculatorButton value="5" onClick={() => inputDigit("5")} />
        <CalculatorButton value="6" onClick={() => inputDigit("6")} />
        <CalculatorButton
          className={styles.operator}
          value="-"
          onClick={() => performOperation("-")}
        />

        <CalculatorButton value="1" onClick={() => inputDigit("1")} />
        <CalculatorButton value="2" onClick={() => inputDigit("2")} />
        <CalculatorButton value="3" onClick={() => inputDigit("3")} />
        <CalculatorButton
          className={styles.operator}
          value="+"
          onClick={() => performOperation("+")}
        />

        <CalculatorButton
          className={styles.zero}
          value="0"
          onClick={() => inputDigit("0")}
        />
        <CalculatorButton value="." onClick={inputDecimal} />
        <CalculatorButton
          className={styles.operator}
          value="="
          onClick={handleEquals}
        />
      </div>
    </div>
  );
};

export default Calculator;
