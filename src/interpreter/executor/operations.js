import { deriveType, getValueIfVariable, convertToNum } from './util';
import { typeEnum } from './enums';

// Operations done as per ecma script guidelined

export function addition(left, right) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

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

export function lessThan(left, right) {
  return abstractRelationalComparison(left, right, '<');
}

export function greaterThan(left, right) {
  return abstractRelationalComparison(left, right, '>');
}

function abstractRelationalComparison(left, right, comparator) {
  let leftVal = getValueIfVariable(left);
  let rightVal = getValueIfVariable(right);

  let leftType = deriveType(left);
  let rightType = deriveType(right);

  let lessThan = comparator === '<';

  if (leftType === typeEnum.STRING && rightType === typeEnum.STRING) {
    if (lessThan) {
      return String(leftVal < rightVal);
    } else {
      return String(leftVal > rightVal);
    }
  }

  leftVal = convertToNum(leftVal, leftType);
  rightVal = convertToNum(rightVal, rightType);

  if (isNaN(leftVal) || isNaN(rightVal)) {
    return 'undefined';
  }

  if (lessThan) {
    return String(leftVal < rightVal);
  } else {
    return String(leftVal > rightVal);
  }
}
