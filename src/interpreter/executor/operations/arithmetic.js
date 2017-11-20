import { Value } from '../classes';
import { typeEnum } from '../enums';
import { valueToJS } from '../util';

export function handleDivision(left, right, output) {
  const result = new Value();
  result.value = valueToJS(left.type, left.value) / valueToJS(right.type, right.value);
  result.type = typeEnum.NUMBER;
  return result;
}

export function handleMultiplication(left, right, output) {
  const result = new Value();
  result.value = valueToJS(left.type, left.value) * valueToJS(right.type, right.value);
  result.type = typeEnum.NUMBER;
  return result;
}

export function handleRemainder(left, right, output) {
  const result = new Value();
  result.value = valueToJS(left.type, left.value) % valueToJS(right.type, right.value);
  result.type = typeEnum.NUMBER;
  return result;
}
