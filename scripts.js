//TODO: PEDMAS, REFACTOR

const operators = ['+', '-', 'x', '÷'];
const units = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ERROR_DISPLAY_TIME = 2000;
const N_DECIMALS = 5;

const operatorButtons = document.querySelectorAll("#calculator>#interface>.operator");
const unitButtons = document.querySelectorAll("#calculator>#interface>.unit");
const clearAllDisplaysButton = document.querySelector("#calculator>#interface>#clear-all");
const backspaceButton = document.querySelector("#calculator>#interface>#backspace");
const decimalButton = document.querySelector("#calculator>#interface>#decimal");
const undoButton = document.querySelector("#calculator>#interface>#undo-last");
const equalsButton = document.querySelector("#calculator>#interface>#equation-result");
const signButton = document.querySelector("#calculator>#interface>#sign")
const equationDisplay = document.querySelector("#calculator>#display>#equation");
const resultDisplay = document.querySelector("#calculator>#display>#result");

clearAllDisplaysButton.onclick = clearAllDisplays;
backspaceButton.onclick = backspaceDisplayEquation;
decimalButton.onclick = appendDisplayDecimalPoint;
undoButton.onclick = undoLastEquationDisplay;
equalsButton.onclick = displayEquationResult;
signButton.onclick = assignSign;
window.addEventListener('keydown', handleKeyboardInputs)

let result = 0;
let undoStack = [""];
const undoLimit = 50;
let isNewSignNumber = false;

unitButtons.forEach((unitButton) =>
    unitButton.addEventListener("click", () => appendDisplayUnit(unitButton.textContent))
)

for (const operatorButton of operatorButtons) {
    operatorButton.addEventListener("click", () => appendDisplayOperator(operatorButton.textContent));
}

function updateUndoStack() {
    if (undoStack.slice(-1) == equationDisplay.textContent) {
        // don't update if there is no change to push
        return;
    }
    if (undoStack.length == undoLimit) {
        undoStack.shift();
    }
    undoStack.push(equationDisplay.textContent);
}

function displayError(errorInfo) {
    const temp = resultDisplay.textContent;
    resultDisplay.textContent = errorInfo
    setTimeout(() => (resultDisplay.textContent = temp), ERROR_DISPLAY_TIME);
}

function appendDisplayUnit(unitStr) {
    resultDisplay.textContent = "";
    const entries = equationDisplay.textContent.split(" ");
    const lastEntry = entries.slice(-1).toString();
    if (lastEntry != "" && isOperator(lastEntry)) {
        if (isNewSignNumber) {
            isNewSignNumber = false;
        } else {
            equationDisplay.textContent += " ";
        }
    }
    if (lastEntry.charAt(lastEntry.length - 1) == "=") {
        equationDisplay.textContent = "";
    }
    equationDisplay.textContent += unitStr;
    updateUndoStack();
}

function appendDisplayDecimalPoint() {
    const lastEntry = equationDisplay.textContent.split(" ").slice(-1).toString();
    const lastChar = lastEntry.slice(-1);
    if (resultDisplay.textContent != "" && lastChar == "=" && !hasDecimalPoint(resultDisplay.textContent)) {
        equationDisplay.textContent = resultDisplay.textContent + "."
        resultDisplay.textContent = ""
    }
    else if (!isNumber(lastEntry) || hasDecimalPoint(lastEntry) || lastEntry == "") {
        displayError("ERROR - impossible decimal point");
    } else {
        equationDisplay.textContent += ".";
        updateUndoStack();
    }
}

function appendDisplayOperator(operatorStr) {
    const lastEntry = equationDisplay.textContent.split(" ").slice(-1).toString();
    const lastChar = lastEntry.slice(-1);
    if (lastChar == "." || lastChar == "") {
        displayError("ERROR - impossible operator placement");
        return;
    } else if (isOperator(lastEntry)) {
        const upToLastEntry = equationDisplay.textContent.split(" ").slice(0, -1);
        equationDisplay.textContent = upToLastEntry.join(" ") + " " + operatorStr;
    }
    else if (lastChar == "=") {
        equationDisplay.textContent = resultDisplay.textContent + " " + operatorStr;
    } else {
        equationDisplay.textContent = equationDisplay.textContent + " " + operatorStr;
    }
    updateUndoStack();
}

function clearAllDisplays() {
    equationDisplay.textContent = "";
    resultDisplay.textContent = "";
    updateUndoStack();
}

function backspaceDisplayEquation() {
    resultDisplay.textContent = "";
    if (equationDisplay.textContent.length != 0) {
        const len = equationDisplay.textContent.length;
        if (equationDisplay.textContent.charAt(len - 1) == " "
            || equationDisplay.textContent.charAt(len - 2) == " ") {
            equationDisplay.textContent = equationDisplay.textContent.slice(0, -2);
        } else {
            equationDisplay.textContent = equationDisplay.textContent.slice(0, -1);
        }
        updateUndoStack();
    }
}

function undoLastEquationDisplay() {
    resultDisplay.textContent = "";
    if (undoStack.length >= 1) {
        equationDisplay.textContent = undoStack.pop();
    }
}

function displayEquationResult() {
    let equationPieces = equationDisplay.textContent.split(" ");
    equationPieces = equationPieces.filter((piece) => (piece != ""));
    const lastEntry = equationPieces.slice(-1).toString();
    const lastChar = lastEntry.charAt(lastEntry.length - 1);
    if (lastChar == "=" || lastEntry == "") {
        if (resultDisplay.textContent != "") {
            equationDisplay.textContent = resultDisplay.textContent;
            resultDisplay.textContent = "";
        }
    } else if (lastChar == "." || isOperator(lastEntry)) {
        displayError("ERROR - equation incomplete");
    } else {
        equationDisplay.textContent += " ="
        result = float_int(equationPieces.shift());
        while (equationPieces.length >= 2) {
            let operator = equationPieces.shift();
            let numPair = float_int(equationPieces.shift());
            result = operateOnPair(operator, result, numPair);
            if (result == "") {
                return;
            }
        }
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(N_DECIMALS));
        }
        resultDisplay.textContent = result.toString();
    }

}

function assignSign() {
    let lastEntry = equationDisplay.textContent.split(" ").slice(-1).toString();
    const lastChar = lastEntry.slice(-1);

    if (lastChar == "=") {
        // sign the last result for the next equation
        if (resultDisplay.textContent.charAt(0) == "-") {
            // remove -
            equationDisplay.textContent = resultDisplay.textContent.slice(1);
        } else {
            // add -
            equationDisplay.textContent = "-" + resultDisplay.textContent;
        }
        resultDisplay.textContent = "";
    } else if (isNewSignNumber) {
        isNewSignNumber = false;
        equationDisplay.textContent = equationDisplay.textContent.slice(0, -1);
    } else if (isOperator(lastEntry)) {
        // absence of a number implies that we can make a new number
        equationDisplay.textContent += " -";
        isNewSignNumber = true;
    } else if (lastChar == "") {
        equationDisplay.textContent += "-";
        isNewSignNumber = true;
    } else if (isNumber(lastEntry)) {
        // existence of a number implies that we need to change the last number's sign
        const upToLastEntry = equationDisplay.textContent.split(" ").slice(0, -1);
        if (lastEntry.charAt(0) == "-") {
            // remove -
            equationDisplay.textContent = upToLastEntry.join(" ") + " " + lastEntry.slice(1);
        } else {
            // add -
            equationDisplay.textContent = upToLastEntry.join(" ") + " " + "-" + lastEntry;
        }
    }
    updateUndoStack();
}

function float_int(string) {
    if (hasDecimalPoint(string)) {
        return parseFloat(string);
    }
    return parseInt(string);
}

function hasDecimalPoint(string) {
    return string.includes(".");
}

function isOperator(string) {
    return (string.length == 1) && (operators.includes(string.charAt(0)));
}

function isNumber(string) {
    return !isOperator(string) && !string.includes("=");
}

function add(x, ...args) {
    let sum = x;
    for (const num of args) {
        sum += num;
    }
    return sum;
}

function subtract(x, ...args) {
    let difference = x;
    for (const num of args) {
        difference -= args;
    }
    return difference;
}

function multiply(x, ...args) {
    let product = x;
    for (const num of args) {
        product *= args;
    }
    return product;
}

function divide(dividend, ...divisors) {
    let quotient = dividend;
    for (const divisor of divisors) {
        quotient /= divisor;
    }
    return quotient;
}

function operateOnPair(operator, x, y) {
    if (operator === '+') {
        return add(x, y);
    } else if (operator === '-') {
        return subtract(x, y);
    } else if (operator === 'x') {
        return multiply(x, y);
    } else if (operator === '÷') {
        return divide(x, y);
    } else {
        throw `Incorrect operator ${operator}`;
    }
}

const keyFunctions = {
    '.': appendDisplayDecimalPoint,
    'Enter': displayEquationResult,
    '=': displayEquationResult,
    'Backspace': backspaceDisplayEquation,
    'Escape': clearAllDisplays,
    '+': appendDisplayOperator,
    '-': appendDisplayOperator,
    '÷': appendDisplayOperator,
    'x': appendDisplayOperator,
    'ArrowLeft': undoLastEquationDisplay,
    'ArrowDown': assignSign,
    'ArrowUp': assignSign,
    'ArrowRight': assignSign,
}

const keyOperatorConversion = {
    '+': '+',
    '-': '-',
    '/': '÷',
    '*': 'x',
    'x': 'x',
}

function handleKeyboardInputs(e) {
    let key = e.key;
    if (key >= 0 && key <= 9) {
        appendDisplayUnit(key.toString());
    } else if (['+', '-', '/', '*', 'x'].includes(key)) {
        key = keyOperatorConversion[key];
        keyFunctions[key](key);
    } else if (key in keyFunctions) {
        keyFunctions[key]();
    }
}
