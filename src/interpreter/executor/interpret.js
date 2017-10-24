// This is our 'state' when interpreting the code
//  Use this enum as a flag for certain logic
const stateEnum = {
    DEFAULT : "default",
    ACCEPTING_VAR : "accepting variable",
    ASSIGNING_VAR : "assigning variable",
    ACCEPTING_CONSOLE : "accepting console",
}

class Variable {
    constructor() {
        this.name = "";
        this.value = "undefined";
        this.inferredType = "";
    }
}

class Console {
    constructor() {
        this.output = "";
    }
}

class Unsupported {
    construcor() {
        this.value = "";
        this.lineNum = "";
    }
}

class Syntax {
    constructor() {
        this.caughtText = "";
        this.lineNum = "";
    }
}

class Expression {
    constructor(derivedFrom) {
        this.numLines = 0;
        this.data = null;
        this.derivedFrom = derivedFrom;
    }
}

// Current interpreter state for program
let currentState = stateEnum.DEFAULT;

// The Current Expression object we are using 
let currExpression = null;

//  List to hold user code, use a list so we can index on stepCount
let userCode = []

// Setup for when we initially check syntax
function setup(inputCode) {
    
    let searchSyntax = false;
    //Check validity of inputCode first
    try {
        // This is how we check for syntax, we need to run this so ignore eslint
        // Backend does not actually call eval
        
        // eslint-disable-next-line
        new Function(inputCode);
    } catch(err) {
        searchSyntax = true;
    }

    // Replace comments
    inputCode = inputCode.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, ' ');
    userCode = inputCode.split(/[\r\n]/)
    return true;
}

// Cleanup function for data structures
function cleanStructures() {
    
    masterRep = [];
    currentDataArray = [];
    currentState = stateEnum.DEFAULT;
    currentStep = 0;
    userCode = [];
    currentDataHold = null;
    currentLineRep = null;
}

function interpretLine(lineNumber) {

    //Clean up structures before processing
    cleanInterpretLineStructures();
    currentLineRep = new LineRep();

    //Handling multi statements on one line
    let statements = userCode[lineNumber].split(';');
    
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        if (statement.trim() === "") {
            continue;
        }

        //Fresh buffer for each statement
        let buffer = "";
        let inString = false;
        let stringStart = '';
        currentState = stateEnum.DEFAULT;

        // Iterate each character in the current user code line
        for (let j = 0; j < statement.length; j++) {
            //Handle strings, we do not want to elim spaces if we are in one
            if (!inString) {
                //Need to be able to flag our start to flag our end
                if (statement[j] === "'") {
                    stringStart = "'";
                    inString = true;
                } else if (statement[j] === '"') {
                    stringStart = '"';
                    inString = true;
                }
            } else if (inString) {

                if (statement[j] === "'" && stringStart === "'") {
                    inString = false;
                } else if (statement[j] === '"' && stringStart === '"') {
                    inString = false;
                }
            }
            
            if (!inString && statement[j] === ' ') {
                continue;
            }
    
            buffer += statement[j]

    if (output.length > 0) {
        flagError = true
        return output;
    }

            if (currentState === stateEnum.DEFAULT) {
                buffer = findBufferState(buffer);                
            } else {
                buffer = evalState(buffer);
            }
        }
    }

    return output;
}

//Cleanup data structures after interpret
function cleanInterpretLineStructures() {
    currentDataArray = [];
    currentDataHold = null;
}

function resolveState(buffer) {

  if (buffer === '') {
    return;
  }
  switch (currentState) {

  case stateEnum.DEFAULT:
    if (shouldBeVariable(buffer) && !isNotCovered(buffer)) {
      noKeywordVariable(buffer);
    }
    break;

        case stateEnum.DEFAULT:
            if (!isNotCovered(buffer)) {
                noKeywordVariable(buffer);
            }
            break;

        case stateEnum.ACCEPTING_VAR:
            if (isVariableName(buffer)) { 
                currentDataHold.name = buffer;
            }
            currentState = stateEnum.DEFAULT;
            break;

        case stateEnum.ASSIGNING_VAR:
            //We may want to talk about type inference
            buffer = specialAssignments(buffer);
            if (isNaN(parseInt(buffer, 10))) {
                if (buffer[0] !== '"' && buffer[0] !== "'") {
                    currentLineRep.variableValue = true;
                }
            }
            currentDataHold.value = buffer;
            currentState = stateEnum.DEFAULT;
            break;
       
        case stateEnum.ACCEPTING_CONSOLE:
            currentState = stateEnum.DEFAULT;
            break;

        default:
            return;
    }
    currentDataHold.value = buffer;
    currentState = stateEnum.DEFAULT;
    break;

  case stateEnum.ACCEPTING_CONSOLE:
    currentState = stateEnum.DEFAULT;
    break;

  default:
    return;
  }
}


// Handle special assignment cases that result in undefined variable
function specialAssignments(buffer) {

    //Catch case where variable is assigned to console log
    if (buffer.includes("console.log(")) {
        let startIndex = buffer.lastIndexOf("console.log(") + "console.log(".length;
        if (buffer.includes('"', startIndex) || buffer.includes("'", startIndex)) {
            currExpression.output = buffer.substring(startIndex + 1, buffer.length - 2);
        } else {
            currentLineRep.consoleOutput = buffer.substring(startIndex, buffer.length - 1);
            currentLineRep.consoleVariable = true;
        }
        buffer = "undefined";
    }
    buffer = 'undefined';
  }

  return buffer;
}
//If we believe we did not catch var but think there is a variable check it
function noKeywordVariable(buffer) {

    currentDataHold = new Variable();
    if (buffer.includes("=")) {
        // We can assume there is something on the other side of
        // the '=' or else we would have a syntax error
        buffer = buffer.split("=");
        if (!isVariableName(buffer[0])) {
            return;
        }
        
        currentDataHold.name = buffer[0];
        currentDataHold.value = specialAssignments(buffer[1]);
        if (isNaN(parseInt(buffer[1], 10))) {
            if (buffer[1][0] !== '"' && buffer[1][0] !== "'") {
                currentLineRep.variableValue = true;
            }
        }
    } else {
        // We do not need to parse buffer since we already did before falling
        // falling into this method, and we know there is no '=' in the buffer
        if (!isVariableName(buffer)) {
            return;
        }
        currentDataHold.name = buffer;
    }

    currentDataHold.name = buffer[0];
    currentDataHold.value = specialAssignments(buffer[1]);
    if (isNaN(parseInt(buffer[1], 10))) {
      if (buffer[1][0] !== '"' && buffer[1][0] !== '\'') {
        currentLineRep.variableValue = true;
      }
    }
  } else {
    // We do not need to parse buffer since we already did before falling
    // falling into this method, and we know there is no '=' in the buffer
    currentDataHold.name = buffer;
  }

  currentDataArray.push(currentDataHold);
}

// Band Aid for things not yet covered
function isNotCovered(buffer) {

    let isNotCovered = false;

    if (buffer.includes("function")) {
        isNotCovered = true;
    } else if (buffer.includes("{")) {
        isNotCovered = true;
    } else if (buffer.includes("}")) {
        isNotCovered = true;
    } else if (buffer.includes("()")) {
        isNotCovered = true;
    } else if (buffer.includes("class")) {
        isNotCovered = true;
    } else if (buffer.includes("let")) {
        isNotCovered = true;
    } else if (buffer.includes("const")) {
        isNotCovered = true;
    } else if (buffer.includes(":")) {
        isNotCovered = true;
    } else if (buffer.includes("?")) {
        isNotCovered = true;
    } else if (buffer.includes("if")) {
        isNotCovered = true;
    } else if (buffer.includes("else")) {
        isNotCovered = true;
    } else if (buffer.includes("for")) {
        isNotCovered = true;
    } else if (buffer.includes("while")) {
        isNotCovered = true;
    } else if (buffer.includes("+")) {
        isNotCovered = true;
    } else if (buffer.includes("-")) {
        isNotCovered = true;
    } else if (buffer.includes("/")) {
        isNotCovered = true;
    } else if (buffer.includes("*")) {
        isNotCovered = true;
    } else if (buffer.includes("%")) {
        isNotCovered = true;
    } else if (buffer.includes("[")) {
        isNotCovered = true;
    } else if (buffer.includes("]")) {
        isNotCovered = true;
    } else if (buffer.includes("==")) {
        isNotCovered = true;
    } else if (buffer.includes("===")) {
        isNotCovered = true;
    } else if (buffer.includes("&")) {
        isNotCovered = true;
    } else if (buffer.includes("|")) {
        isNotCovered = true;
    } else if (buffer.includes("<")) {
        isNotCovered = true;
    } else if (buffer.includes(">")) {
        isNotCovered = true;
    } else if (buffer.includes("\\")) {
        isNotCovered = true;
    }
    return isNotCovered;
}

// Handle our current state cases
function evalState(buffer) {

  switch (currentState) {

  //We should not ever hit this case but let's put it in here just in case
  case stateEnum.DEFAULT:
    findBufferState(buffer);
    break;

  case stateEnum.ACCEPTING_VAR:
    buffer = acceptingVar(buffer);
    break;

  case stateEnum.ASSIGNING_VAR:
    break;

  case stateEnum.ACCEPTING_CONSOLE:
    buffer = acceptingConsole(buffer);
    break;

  default:
    return buffer;

  }
  return buffer;
}

// If we are taking in console input
function acceptingConsole(buffer) {
    
    //There has to be a better way
    if (buffer[buffer.length - 1] === ')') {
        if(buffer[0] === "'" || buffer[0] === '"') {
            currExpression.data.output = buffer.substring(1, buffer.length - 2);
        } else {
            currentLineRep.consoleOutput = buffer.substring(0, buffer.length - 1);
            currentLineRep.consoleVariable = true;
        }
        buffer = "";
        currState = stateEnum.DEFAULT;
    }
    buffer = '';
  }
  return buffer;
}

// If we are in accepting_var state
function acceptingVar(buffer) {

    if (buffer[buffer.length - 1] === '=') {
        buffer = buffer.substring(0, buffer.length - 1);
        
        currExpression.data.name = buffer

    currentDataHold.name = buffer;

    //Reset Variable to start accepting value
    buffer = '';
    currentState = stateEnum.ASSIGNING_VAR;
  }
  return buffer;
}

//Evaluate our buffer to try to find a state
function findBufferState(buffer) {

    switch (buffer) {
        case "var":
            currentState = stateEnum.ACCEPTING_VAR;
            currExpression.data = new Variable();
            buffer = "";
            break;
        case "console.log(":
            currentState = stateEnum.ACCEPTING_CONSOLE;
            currExpression.data = new Console();
            buffer = "";
            break;
        default:
            currentState = stateEnum.DEFAULT;
            break;
    }

  return buffer;
}

// Global evaluate function called on the step and run click
function evaluate(inputCode) {
  
    return setup(inputCode);
}
