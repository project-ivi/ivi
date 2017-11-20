import { Expression, Console, Variable } from '../classes';
import { getClosestValue, insertValueByVariableName } from '../state';

/**
 * 
 * @param {*} left The left side of the assignment.
 * @param {*} right The right should hold a Value object at the point..
 */
export function handleAssignment(left, right, output) {
  const varDeclarationLookup = left.indexOf('var ');
  const varName = varDeclarationLookup != -1 ? left.substring(varDeclarationLookup + 4) : left;

  insertValueByVariableName(varName, right);

  const step = new Expression();
  step.data = new Variable();
  step.data.name = varName;
  step.data.value = right.value;
  output.push(step);

  // const step2 = new Expression();
  // step2.data = new Console();
  // step2.data.output = right.value;
  // output.push(step2);
  return right;
}