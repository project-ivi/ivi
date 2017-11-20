import { Console, Expression, Syntax, Unsupported, Variable } from './classes';
import { stateEnum, operationsEnum } from './enums';
import { increaseScope, decreaseScope, getClosestValue, insertVar } from './state';
import { isNotCovered, isVariableName } from './util';
import { operate } from './operations';

// Setup for when we initially check syntax
export function evaluate(inputCode) {
  const output = [];

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

  // Interpret our code
  for (let i = 0; i < inputCode.length; i++) {
    if (inputCode[i].trim() != '') {
      interpretLine(inputCode[i].trim(), output);
    }
  }

  return {
    error: false,
    output: output,
  };
}

// Master interpret function, will insert into output on consume,
// Will return expression if no expression consumed
function interpretLine(inputLine, output) {
  // New expression to build into
  let currExpression = new Expression(inputLine);

  // Initialize some variables
  let buffer = '';
  let inString = false;
  let stringStart = '';
  let currentState = stateEnum.DEFAULT;
  
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

    // Not in string and tab, continue
    if (!inString && inputLine[i] === '\t') {
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
  }

  operate(buffer, output);
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
