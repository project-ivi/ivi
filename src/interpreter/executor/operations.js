import { deriveType, getValueIfVariable, convertToNum } from './util';
import { typeEnum } from './enums';

// Operations done as per ECMAScript guideline
export function addition(left, right) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

  // String concatenation if either value is a string.
  if (leftType === typeEnum.STRING || rightType === typeEnum.STRING) {
    return '\'' + String(leftVal) + String(rightVal) + '\'';
  }

  leftVal = convertToNum(leftVal, leftType);
  rightVal = convertToNum(rightVal, rightType);

  if (isNaN(leftVal) || isNaN(rightVal)) {
    return 'NaN';
  }
  return String(leftVal + rightVal);
}

export function division(left, right) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

  leftVal = convertToNum(leftVal, leftType);
  rightVal = convertToNum(rightVal, rightType);

  if (isNaN(leftVal) || isNaN(rightVal)) {
    return 'NaN';
  }
  return String(leftVal / rightVal);
}

export function multiplication(left, right) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

  leftVal = convertToNum(leftVal, leftType);
  rightVal = convertToNum(rightVal, rightType);

  if (isNaN(leftVal) || isNaN(rightVal)) {
    return 'NaN';
  }
  return String(leftVal * rightVal);
}

export function remainder(left, right) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

  leftVal = convertToNum(leftVal, leftType);
  rightVal = convertToNum(rightVal, rightType);

  if (isNaN(leftVal) || isNaN(rightVal)) {
    return 'NaN';
  }
  return String(leftVal % rightVal);
}

export function subtraction(left, right) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

  leftVal = convertToNum(leftVal, leftType);
  rightVal = convertToNum(rightVal, rightType);

  if (isNaN(leftVal) || isNaN(rightVal)) {
    return 'NaN';
  }
  return String(leftVal - rightVal);
}
