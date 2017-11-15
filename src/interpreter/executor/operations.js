import { deriveType, getValueIfVariable } from './util';
import { typeEnum } from './enums';

export function addition(left, right) {
  let leftType = deriveType(left);
  let rightType = deriveType(right);

  if (leftType === typeEnum.STRING || rightType === typeEnum.STRING) {
    return '\'' + String(getValueIfVariable(left)) + String(getValueIfVariable(right)) + '\'';
  } else if (leftType === typeEnum.NAN || rightType === typeEnum.NAN) {
    return 'NaN';
  } else if (leftType === typeEnum.NUMBER && rightType === typeEnum.NUMBER) {
    return String(Number(getValueIfVariable(left)) + Number(getValueIfVariable(right)));
  } else { //Handle undefined and all other undefined cases
    return 'NaN';
  }
}

export function subtraction(left, right) {
  let leftType = deriveType(left);
  let rightType = deriveType(right);
  if (leftType === typeEnum.NUMBER && rightType === typeEnum.NUMBER) {
    return String(Number(getValueIfVariable(left)) - Number(getValueIfVariable(right)));
  } else {
    return 'NaN';
  }
}
