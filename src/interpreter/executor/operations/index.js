import { operationsEnum as operators } from '../enums';
import { handleDivision, handleMultiplication, handleRemainder } from './arithmetic';
import { handleAssignment } from './assignment';
import { handleLogicalNot } from './logic';
import { deriveType, stringToValue } from '../util';

/*
 * Operate finds the value 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 */
export function operate(expression, output) {
  const level3 = handleLevel3(expression, output);
  if (level3) return level3;
  
  const level13 = handleLevel13(expression, output);
  if (level13) return level13;
  
  const level14 = handleLevel14(expression, output);
  if (level14) return level14;
  
  const level16 = handleLevel16(expression, output);
  if (level16) return level16;

  const level20 = handleLevel20(expression, output);
  if (level20) return level20;

  return handleBase(expression, output);
}

/*
 * Level 20 operations:
 * Grouping - n/a
 */
function handleLevel20(expression, output) {
  const firstParenthesis = expression.indexOf(operators.GROUPING_START);
  const secondParenthesis = expression.lastIndexOf(operators.GROUPING_END);

  if (firstParenthesis < 0 || secondParenthesis < 0) return null;
  
  // Retrieve the value of the most inner grouping before evaluating the rest in order.
  return operate(expression.substring(firstParenthesis + 1, secondParenthesis), output);
}

/*
 * Level 16 operations:
 * Logical NOT - Right associative
 */
function handleLevel16(expression, output) {
  const logicalNotIndex = expression.lastIndexOf(operators.LOGICAL_NOT);

  if (logicalNotIndex < 0) return null;
  
  // Retrieve the value of the most inner grouping before evaluating the rest in order.
  const subExpression = operate(expression.substring(logicalNotIndex + 1), output);
  return handleLogicalNot(subExpression, output);
}

/*
 * Level 14 operations:
 * Division - Left associative
 * Multiplication - Left associative
 * Remainder - Left associative
 */
function handleLevel14(expression, output) {
  const divisionIndex = expression.lastIndexOf(operators.DIVISION);
  const multiplicationIndex = expression.lastIndexOf(operators.MULTIPLICATION);
  const remainderIndex = expression.lastIndexOf(operators.REMAINDER);

  // Handle the first operation found at this level of precedence.
  const smallestIndex = Math.max(divisionIndex, multiplicationIndex, remainderIndex);

  if (smallestIndex < 0) {
    return null;

  } else if (smallestIndex == divisionIndex) {
    const left = operate(expression.substring(0, divisionIndex).trim(), output);
    const right = operate(expression.substring(divisionIndex + 1).trim(), output);
    return handleDivision(left, right, output);

  } else if (smallestIndex == multiplicationIndex) {
    const left = operate(expression.substring(0, multiplicationIndex).trim(), output);
    const right = operate(expression.substring(multiplicationIndex + 1).trim(), output);
    return handleMultiplication(left, right, output);

  } else if (smallestIndex == remainderIndex) {
    const left = operate(expression.substring(0, remainderIndex).trim(), output);
    const right = operate(expression.substring(remainderIndex + 1).trim(), output);
    return handleRemainder(left, right, output);

  }

  return null;
}

/*
 * Level 13 operations:
 * Addition - Left associative
 * Subtraction - Left associative
 */
function handleLevel13(expression, output) {
  const additionIndex = expression.lastIndexOf(operators.ADDITION);
  const subtractionIndex = expression.lastIndexOf(operators.SUBTRACTION);

  // Handle the first operation found at this level of precedence.
  const smallestIndex = Math.max(additionIndex, subtractionIndex);

  return null;
}

/*
 * Level 3 operations:
 * Assignment - Right associative
 */
function handleLevel3(expression, output) {
  const assignmentIndex = expression.lastIndexOf(operators.ASSIGNMENT);
  
  if (assignmentIndex < 0) return null;
  
  const left = expression.substring(0, assignmentIndex).trim();
  const right = expression.substring(assignmentIndex + 1).trim();
  
  // Assignment is right-associative. Recursively handle right.
  return handleAssignment(left, operate(right, output), output);
}

/**
 * There should be no readable symbols at this point. Convert expression to values and add them to the stack.
 * @param {*} expression 
 * @param {*} values 
 */
function handleBase(expression, output) {
  return stringToValue(expression.trim());
}
