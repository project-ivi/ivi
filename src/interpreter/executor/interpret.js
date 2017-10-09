// This is our 'state' when interpreting the code
//  Use this enum as a flag for certain logic
const stateEnum = {
    DEFAULT : "default",
    ACCEPTING_VAR : "accepting variable",
    ASSIGNING_VAR : "assigning variable",
    ACCEPTING_CONSOLE : "accepting console"
}

class Variable {
    constructor() {
        this.name = "";
        this.value = "";
    }
}

class LineRep {
    constructor() {
        this.lineNumber = -1;
        this.dataArray = [];
        this.consoleOutput = "";
        this.unsupported = false;
    }
}

// Our master state that we will output to visualizer
let masterRep = [];

// Single line representation we will push to master Rep
let currentDataArray = [];

// Current interpreter state for program
let currentState = stateEnum.DEFAULT;

// Current step in the user input code
let currentStep = 0;

// Current object we are adding data to
let currentDataHold = null;

// Hold our current Line rep to store data into before we push to master rep
let currentLineRep = null;

// Global var to bump out of interpreting if in a block comment
let isBlockComment = false;

//  List to hold user code, use a list so we can index on stepCount
let userCode = []

// Setup for when we initially check syntax
function setup(inputCode) {
    
    //Check validity of inputCode first
    try {
        // This is how we check for syntax, we need to run this so ignore eslint
        // Backend does not actually call eval
        
        // eslint-disable-next-line
        new Function(inputCode);
    } catch(err) {
        return false;
    }
    
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
    isBlockComment = false;
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
        currentState = stateEnum.DEFAULT;

        // Iterate each character in the current user code line
        for (let j = 0; j < statement.length; j++) {
            if (statement[j] === ' ') {
                continue;
            }
    
            buffer += statement[j]
            
            //Handling comments here
            if (isBlockComment && buffer === '*') {
                continue;
            }
            if (handleComments(buffer) || isBlockComment) {
                buffer = "";
                break;
            }

            //Skip on cases not yet covered yet
            if (isNotCovered(buffer)) {
                currentLineRep.unsupported = true;
                buffer = "";
                break;
            }

            if (currentState === stateEnum.DEFAULT) {
                buffer = findBufferState(buffer);
            } else {
                buffer = evalState(buffer);
            }        
        }
        resolveState(buffer);
    }

    currentLineRep.lineNumber = lineNumber;
    currentLineRep.dataArray = currentDataArray;
    masterRep.push(currentLineRep);
}


// Beginning basic comment support
function handleComments(buffer) {

    if (buffer === "//") {
        return true;
    }

    if (buffer === "/*") {
        isBlockComment = true;
        return true;
    }

    if (buffer.includes("*/")) {
        isBlockComment = false;
        return true;
    }

    return false;
}

//Cleanup data structures after interpret
function cleanInterpretLineStructures() {
    currentDataArray = [];
    currentDataHold = null;
}


function resolveState(buffer) {

    if (buffer === "") {
        return;
    }
    switch (currentState) {

        case stateEnum.DEFAULT:
            if (shouldBeVariable(buffer) && !isNotCovered(buffer)) {
                noKeywordVariable(buffer);
            }
            break;

        case stateEnum.ACCEPTING_VAR:
            currentDataHold.name = buffer;
            currentState = stateEnum.DEFAULT;
            break;

        case stateEnum.ASSIGNING_VAR:
            //We may want to talk about type inference
            buffer = specialAssignments(buffer);
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
        currentLineRep.consoleOutput = buffer.substring(buffer.lastIndexOf("console.log(" + 1, 
                                                                            buffer.length - 2));
        buffer = "";
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
        if (!isNaN(parseInt(buffer[0], 10))) {
            return;
        }
        
        currentDataHold.name = buffer[0];
        currentDataHold.value = buffer[1];

    } else {
        // We do not need to parse buffer since we already did before falling
        // falling into this method, and we know there is no '=' in the buffer
        currentDataHold.name = buffer;
    }

    currentDataArray.push(currentDataHold);
}


// Boolean function to determine if we should treat default state as variable
// May not need this if there are not many cases
function shouldBeVariable(buffer) {

    let isVar = true;

    if (!isNaN(parseInt(buffer, 10))) {
        isVar = false;
    }

    return isVar;
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
        
        currentLineRep.consoleOutput = buffer.substring(1, buffer.length - 2);
        buffer = "";
    }
    return buffer;
}

// If we are in accepting_var state
function acceptingVar(buffer) {

    if (buffer[buffer.length - 1] === '=') {
        buffer = buffer.substring(0, buffer.length - 1);
        
        currentDataHold.name = buffer

        //Reset Variable to start accepting value
        buffer = "";
        currentState = stateEnum.ASSIGNING_VAR;
    }
    return buffer;
}

//Evaluate our buffer to try to find a state
function findBufferState(buffer) {

    switch (buffer) {
        case "var":
            currentState = stateEnum.ACCEPTING_VAR;
            currentDataHold = new Variable();
            currentDataArray.push(currentDataHold);
            buffer = "";
            break;
        case "console.log(":
            currentState = stateEnum.ACCEPTING_CONSOLE;           
            buffer = "";
            break;
        default:
            currentState = stateEnum.DEFAULT;
            break;
    }

    return buffer;
}

// Global evaluate function called on the step and run click
export function evaluate(inputCode) {
   
    //Cleanup our structures before processing
    cleanStructures();

    if (!setup(inputCode)) {
        return false;
    }
    
    //While we haven't evaluated all of our code
    while (currentStep < userCode.length) {
        interpretLine(currentStep);
        currentStep += 1;
    }

    return masterRep;
}

// Print out our representation
function masterRepToString(representation) {

    representation.forEach(function(rep) {
        console.log("Line Number: " + rep.lineNumber);
        if (rep.lineNumber !== "") {
            console.log("Console output: " + rep.consoleOutput);
        }
        if (rep.unsupported) {
            console.log("Unsupported element at line: " + rep.lineNumber);
        }

        rep.dataArray.forEach(function(dataClass) {
            console.log(JSON.stringify(dataClass));
        });
    });
}

const code = `

            var testing
            function helloWorld() {
                var a=2;
                var b = 3
                c = 4;
                d = 5
                var e;
                f;
                g
                //Comments work in the code only at beginning of line
                /* Block
                   Comments
                   Work
                   Too 
                */
                console.log('hello');
                var h = 2;
                var x = console.log("test");
            }`;

const ret = evaluate(code);
if (!ret) {
    console.log("Syntax error");
} else {
    masterRepToString(ret);
}
