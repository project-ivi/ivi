import { state, log, resetState } from './state';
import { evaluate, resetScope } from './interpret';

let output = null;

export function submitCode(code) {
  // Reset the state of the interpreter before the code gets evaluated.
  const result = evaluate(code);
  resetState();

  if (result.error) {
    for (const elem of result.output) {
      log.push(elem.value);
    }
    return false;

  } else {
    output = result.output;

    // Ideally this is constructed as a queue but because of JavaScript
    // limitations the default implementation is an O(n) operation on access,
    // so in order to increase performance we will reverse the list and use
    // pop() for O(1) operations.
    output.reverse();
    return true;

  }
}

/**
 * Updates the state with the next step.
 * Returns false if there are no more valid moves.
 */
export function nextStep() {
  if (!output || output.length == 0) {
    return false;
  }

  // Retrieve next value in the executor list.
  const action = output.pop();

  const expression = action.data;
  switch (expression.constructor.name) {
  case 'Console':
    log.push(expression.output);
    break;
  case 'Variable':
    state[expression.name] = expression.value;
    break;
  default:
    break;
  }

  return true;
}

export function resetInterpreter() {
  output = null;
  resetState();
  resetScope();
}

export function getState() {
  return state;
}

export function getLog() {
  return log;
}
