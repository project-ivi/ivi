import { Console, Expression, Syntax, Unsupported, Variable } from './classes';
import { stateEnum, operationsEnum } from './enums';
import { increaseScope, decreaseScope, getClosestValue, insertVar} from './state';
import { isNotCovered, isVariableName } from './util';
import { addition, division, remainder, multiplication, subtraction, lessThan, greaterThan } from './operations';
// Hack
import { Conditional, filterOutConditionals, reInsertConditionals, handleWinner } from './finish442Hacks';

// Output of expressions for visualiser
let output = [];

// Setup for when we initially check syntax
export function evaluate(inputCode) {
  let searchSyntax = false;
  //Check validity of inputCode first
  try {
    // This is how we check for syntax, we need to run this so ignore eslint
    // Backend does not actually call eval
    new Function(inputCode);
  } catch (err) {
    // Flip to check syntax if we caught an error
    searchSyntax = true;
  }
  // Replace comments
  inputCode = inputCode.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');

  //Hack
  inputCode = filterOutConditionals(inputCode);

  // Split on semi colons for multiline support
  inputCode = inputCode.split(/;/);

  // Check our code for unsupported errors, and syntax errors if we need to
  for (let i = 0; i < inputCode.length; i++) {
    if (isNotCovered(inputCode[i])) {
      let unsupported = new Unsupported(inputCode[i]);
      output.push(unsupported);

    } else if (searchSyntax) {
      try {
        new Function(inputCode[i]);

      } catch (err) {
        let syntax = new Syntax(inputCode[i]);
        output.push(syntax);

      }
    }
  }

  // If we have output at this point, bump out and don't interpret
  if (output.length > 0) {
    return {
      error: true,
      output: output,
    };
  }

  inputCode = reInsertConditionals(inputCode);

  // Interpret our code
  for (let i = 0; i < inputCode.length; i++) {

    // Hack
    if (inputCode[i] instanceof Conditional) {
      let newCommands = handleWinner(inputCode[i]);
      inputCode.splice(i, 1);
      newCommands.reverse();
      for (let j = 0; j < newCommands.length; j++) {
        inputCode.splice(i, 0, newCommands[j]);
      }
      // In case next is also a conditional we need to send back to loop
      i -= 1;
      continue;
    }



    if (inputCode[i].trim() != '') {
      interpretLine(inputCode[i].trim());
    }
  }

  return {
    error: false,
    output: output,
  };
}

// Master interpret function, will insert into output on consume,
// Will return expression if no expression consumed
function interpretLine(inputLine) {
  // New expression to build into
  let currExpression = new Expression(inputLine);

  // Initialize some variables
  let buffer = '';
  let inString = false;
  let stringStart = '';
  let currentState = stateEnum.DEFAULT;
  let resTup = null;
  // For each character in our inputLine
  for (let i = 0; i < inputLine.length; i++) {
    // String handling, do not skip spaces for strings
    if (!inString) {
      if (inputLine[i] === '\'') {
        stringStart = '\'';
        inString = true;
      } else if (inputLine[i] === '"') {
        stringStart = '"';
        inString = true;
      }
    } else if (inString) {
      if (inputLine[i] === '\'' && stringStart === '\'') {
        inString = false;
      } else if (inputLine[i] === '"' && stringStart === '"') {
        inString = false;
      }
    }

    // Not in string and space, continue
    if (!inString && (inputLine[i] === ' ' || inputLine[i] === '\t')) {
      continue;
    }

    // If new line keep going, but tell our expression
    if (inputLine[i] === '\n') {
      currExpression.numLines += 1;
      continue;
    }

    if (inputLine[i] === '{') {
      increaseScope();
      continue;
    } else if (inputLine[i] === '}') {
      decreaseScope();
      continue;
    }

    buffer += inputLine[i];

    resTup = arithmetic(buffer, inputLine, currentState);
    if (resTup[1] === stateEnum.CONSUMED) {
      currExpression.derivedFrom = resTup[0];
      break;
    }

    // If we haven't found buffer, try to find, else eval
    if (currentState === stateEnum.DEFAULT) {
      resTup = findBufferState(buffer, currExpression);
    } else {
      resTup = evalState(buffer, currentState, currExpression, inputLine);
    }

    // Update our buffer and state
    buffer = resTup[0];
    currentState = resTup[1];

    // If we consumed, exit our expression
    if (currentState === stateEnum.CONSUMED) {
      output.push(currExpression);
      return;
    }
  }

  // Handle case where we didn't see key words, try to find expression
  currentState = looseEnds(buffer, currentState, currExpression);
  if (currentState === stateEnum.CONSUMED) {
    output.push(currExpression);
    return;
  }

  if (isVariableName(buffer.trim()) && getClosestValue(buffer.trim()) === 'undefined') {
    currExpression.derivedFrom = 'undefined';
  }
  return currExpression;
}

// Evaluate a sub expression, if we didn't get a return, grab last output expression
// If we did return that expression
function getSubExpression(inputText) {
  let evaledExpression = interpretLine(inputText);
  return evaledExpression = evaledExpression === undefined ? output[output.length - 1] : evaledExpression;
}

function getSubExpressionValue(evaledExpression) {

  if (evaledExpression.data === null) {
    if (isVariableName(evaledExpression.derivedFrom.trim())) {
      return getClosestValue(evaledExpression.derivedFrom.trim());
    } else {
      return evaledExpression.derivedFrom.trim();
    }
  } else {
    if (evaledExpression.data instanceof Console) {
      return 'undefined';

    } else if (evaledExpression.data instanceof Variable) {
      return evaledExpression.data.value;
    }
  }
}

// Handle cases where we never found a buffer state for the expression
function looseEnds(buffer, currentState, currExpression) {

  if (currentState === stateEnum.ACCEPTING_VAR) {
    if (isVariableName(buffer.trim())) {
      currExpression.data.name = buffer.trim();
      insertVar(currExpression.data);
      currentState = stateEnum.CONSUMED;
    }
  }
  return currentState;
}

//Evaluate our buffer to try to find a state
function findBufferState(buffer, currExpression) {

  let currentState = stateEnum.DEFAULT;

  // Handle non-labeled variables
  if (buffer.indexOf('=') >= 0) {
    currentState = stateEnum.ASSIGNING_VAR;
    currExpression.data = new Variable();
    currExpression.data.name = buffer.substring(0, buffer.indexOf('=')).trim();
    return ['', currentState];
  }

  // Switch on key words, insert base object if found into expression
  switch (buffer) {
  case 'var':
    currentState = stateEnum.ACCEPTING_VAR;
    currExpression.data = new Variable();
    buffer = '';
    break;
  case 'console.log(':
    currentState = stateEnum.ACCEPTING_CONSOLE;
    currExpression.data = new Console();
    buffer = '';
    break;
  default:
    currentState = stateEnum.DEFAULT;
    break;
  }

  return [buffer, currentState];
}

// Handle our current state cases
function evalState(buffer, currentState, currExpression, inputLine) {

  let resTup = [buffer, currentState];
  switch (currentState) {

  case stateEnum.ACCEPTING_VAR:
    resTup = acceptingVar(buffer, currExpression);
    break;

  case stateEnum.ASSIGNING_VAR:
    resTup = assigningVar(buffer, currentState, currExpression, inputLine);
    break;

  case stateEnum.ACCEPTING_CONSOLE:
    resTup = acceptingConsole(buffer, currExpression, inputLine);
    break;

  default:
    return buffer;

  }
  return resTup;
}

// Handle assigning variable state
function assigningVar(buffer, currentState, currExpression, inputLine) {
  // Get rest of the line and evaluate right side assignment expressions
  let restOfLine = inputLine.substring(inputLine.indexOf('=') + 1);
  let evaledExpression = getSubExpression(restOfLine);

  currExpression.data.value = getSubExpressionValue(evaledExpression);

  // Insert the value into our known variables
  insertVar(currExpression.data);
  return ['', stateEnum.CONSUMED];
}

// If we are taking in console input
function acceptingConsole(buffer, currExpression, inputLine) {

  // Get what is in the parenthesis
  inputLine = inputLine.trim();
  let inParens = inputLine.substring(inputLine.indexOf('console.log(') + 'console.log('.length, inputLine.length - 1);
  // If we see a variable name grab value, otherwise eval expression and grab result
  if (isVariableName(inParens)) {
    currExpression.data.output = getClosestValue(inParens);
  } else {
    let evaledExpression = getSubExpression(inParens);
    if (evaledExpression.data === null) {
      currExpression.data.output = evaledExpression.derivedFrom.trim();
    } else {
      currExpression.data.output = 'undefined';
    }
  }

  return ['', stateEnum.CONSUMED];
}

// If we are in accepting_var state
function acceptingVar(buffer, currExpression) {

  let currentState = stateEnum.ACCEPTING_VAR;

  // If we see '=' shift to accepting value state and assign name to expression
  if (buffer[buffer.length - 1] === '=') {
    buffer = buffer.substring(0, buffer.length - 1);

    currExpression.data.name = buffer;

    currentState = stateEnum.ASSIGNING_VAR;
  }
  return [buffer, currentState];
}

function arithmetic(buffer, inputLine, currentState) {
  let newState = stateEnum.CONSUMED;
  let left = buffer.substring(0, buffer.length - 1);
  let right = null;
  switch (buffer[buffer.length - 1]) {
  case operationsEnum.ADDITION:
    right = inputLine.substring(inputLine.indexOf('+') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = addition(left, right);
    break;
  case operationsEnum.DIVISION:
    right = inputLine.substring(inputLine.indexOf('/') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = division(left, right);
    break;
  case operationsEnum.REMAINDER:
    right = inputLine.substring(inputLine.indexOf('%') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = remainder(left, right);
    break;
  case operationsEnum.MULTIPLICATION:
    right = inputLine.substring(inputLine.indexOf('*') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = multiplication(left, right);
    break;
  case operationsEnum.SUBTRACTION:
    right = inputLine.substring(inputLine.indexOf('-') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = subtraction(left, right);
    break;
  case operationsEnum.LESS_THAN:
    right = inputLine.substring(inputLine.indexOf('<') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = lessThan(left, right);
    break;
  case operationsEnum.GREATER_THAN:
    right = inputLine.substring(inputLine.indexOf('>') + 1);
    right = getSubExpressionValue(getSubExpression(right));
    buffer = greaterThan(left, right);
    break;
  default:
    newState = currentState;
    break;
  }
  return [buffer, newState];
}
