import { typeEnum } from '../enums';
import { valueToJS } from '../util';

/**
 * Transforms the given value to logical not.
 * @param {*} value 
 */
export function handleLogicalNot(value, output) {
  value.value = !valueToJS(value.type, value.value);
  value.type = typeEnum.BOOLEAN;
  return value;
}