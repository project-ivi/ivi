import { deriveType, stripIfString } from './util';
import { typeEnum } from './enums';

export function addition(left, right) {
  let leftType = deriveType(left);
  let rightType = deriveType(right);
  if (leftType === typeEnum.STRING || rightType === typeEnum.STRING) {
    return '\'' + String(stripIfString(left)) + String(stripIfString(right)) + '\'';
  } else if (leftType === typeEnum.NAN || rightType === typeEnum.NAN) {
    return 'NaN';
  } else if (leftType === typeEnum.NUMBER && rightType === typeEnum.NUMBER) {
    return String(Number(left) + Number(right));
  } else { //Handle undefined and all other undefined cases
    return 'NaN';
  }
}

export function subtraction(left, right) {
  let leftType = deriveType(left);
  let rightType = deriveType(right);
  if (leftType === typeEnum.NUMBER && rightType === typeEnum.NUMBER) {
    return String(Number(left) - Number(right));
  } else {
    return 'NaN';
  }
}
