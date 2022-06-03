function add(x, ...args) {
    let sum = x;
    for (num in args) {
        sum += num;
    }
    return sum;
}

function subtract(x, ...args) {
    let difference = x;
    for (num in args) {
        difference -= args;
    }
    return difference;
}

function multiply(x, ...args) {
    let product = x;
    for (num in args) {
        product *= args;
    }
    return product;
}

function divide(dividend, ...divisors) {
    let quotient = dividend;
    for (divisor in divisors) {
        quotient /= divisor;
    }
    return quotient;
}

function operate(operator, x, y) {
    if (operator === 'add') {
        return add(x, y);
    } else if (operator === 'subtract') {
        return subtract(x, y);
    } else if (operator === 'multiply') {
        return multiply(x, y);
    } else if (operator === 'divide') {
        return divide(x, y);
    } else {
        throw `Incorrect operator ${operator}`;
    }
}

const operators = ['+', '-', 'x', '÷']
const units = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const operatorButtons = document.querySelectorAll("#calculator>#interface>.operator");
const unitButtons = document.querySelectorAll("#calculator>#interface>.unit");
const undoButton = document.querySelector("#calculator>#interface>#undo-last");
const clearAllButton = document.querySelector("#calculator>#interface>#clear-all");
const backspaceButton = document.querySelector("#calculator>#interface>#backspace");
const decimalButton = document.querySelector("#calculator>#interface>#decimal");
const equalsButton = document.querySelector("#calculator>#interface>#equation-result")
const equationDisplay = document.querySelector("#calculator>#display>#equation");
const resultDisplay = document.querySelector("#calculator>#display>#result");

let result = 0;
let lastOperatorPair = "";
let secondPair = 0;
let firstPair = 0;

for (const unitButton of unitButtons) {
    unitButton.addEventListener("click", appendDisplayUnit);
}
for (const operatorButton of operatorButtons) {
    operatorButton.addEventListener("click", appendDecimal);
}

function appendDisplayUnit(e) {
    equationDisplay.textContent += `${e.target.id}`;
}

function appendDecimal(e) {
    if (units.includes(equationDisplay.textContent.slice(-1))) {
        equationDisplay.textContent += ".";
    } else {
        const temp = resultDisplay.textContent;
        resultDisplay.textContent = "ERROR - multiple decimals"
        setTimeout(() => ())
    }
}

function clearDisplay(e) {
    if (e.target.id === 'AC') {
        equationDisplay.textContent = "";
    } else if (e.target.id === 'C') {
        equationDisplay.textContent = equationDisplay.textContent.slice(0, -1);
    }
}