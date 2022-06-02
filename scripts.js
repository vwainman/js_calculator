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

