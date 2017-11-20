import { log, resetState, insertAtScope, insertConditionAtScope } from './state';
import { evaluate } from './interpret';

let expressions = [];

export function submitCode(code) {
  const result = evaluate(code);
  resetState();

  if (result.error) {
    const errors = result.output;
    while (errors.length > 0) {
      log.push(errors.pop().value);
    }

    return false;

  } else {
    expressions = result.output;

    // Ideally this is constructed as a queue but because of JavaScript
    // limitations the default implementation is an O(n) operation on access,
    // so in order to increase performance we will reverse the list and use
    // pop() for O(1) operations.
    expressions.reverse();

    return true;
  }
}

/**
 * Updates the state with the next step.
 * Returns false if there are no more valid moves.
 */
export function nextStep() {
  if (!expressions || expressions.length == 0) {
    return false;
  }

  // Retrieve next value in the executor list.
  const action = expressions.pop();

  const expression = action.data;
  switch (expression.constructor.name) {
  case 'Console':
    log.push(expression.output);
    break;
  case 'Variable':
    insertAtScope(expression.scope, expression);
    break;
  case 'Conditional':
    insertConditionAtScope(expression.scope, expression);
    break;
  default:
    break;
  }

  return true;
}

export function resetInterpreter() {
  resetState();
}

export function getLog() {
  return log;
}
