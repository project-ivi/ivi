"use strict";
// This is our 'state' when interpreting the code
//  Use this enum as a flag for certain logic
const stateEnum = {
    DEFAULT : "default",
    ACCEPTING_VAR : "accepting variable",
    ASSIGNING_VAR : "assigning variable"
}

function Variable() {
    this.name = "";
    this.value = "";
}

// Our master state that we will output to visualizer
var masterRep = [];

// Single line representation we will push to master Rep
var currentLineRep = [];

// Current interpreter state for program
var currentState = stateEnum.DEFAULT;

// Current step in the user input code
var currentStep = 0;

// Current object we are adding data to
var currentDataHold = null;

//  Flag to tell code editor to be writable or not
var isRunning = false;

// Global var to bump out of interpreting if in a block comment
var isBlockComment = false;

//  List to hold user code, use a list so we can index on stepCount
var userCode = []

// Setup for when we initially check syntax
function setup(inputCode) {
    
    //Lock  the code editor
    isRunning = true;
    
    //Check validity of inputCode first
    try {
        new Function(inputCode);
    } catch(err) {
        exitInterpret();
        return false;
    }
    
    userCode = inputCode.split(/[\r\n]+/)
    return true;
}

// Cleanup function to be called whenever exiting interpreter
function exitInterpret() {
    
    masterRep = [];
    currentLineRep = [];
    currentState = stateEnum.DEFAULT;
    currentStep = 0;
    isRunning = false;
    userCode = [];
    isBlockComment = false;
    currentDataHold = null;
}

function interpretLine(lineNumber) {

    //Handling multi statements on one line
    var statements = userCode[lineNumber].split(';');
    
    for (var i = 0; i < statements.length; i++) {
        var statement = statements[i];
        if (statement.trim() == "") {
            continue;
        }

        //Fresh buffer for each statement
        var buffer = "";

        // Iterate each character in the current user code line
        for (var j = 0; j < statement.length; j++) {
            if (statement[j] == ' ') {
                continue;
            }
    
            buffer += statement[j]
            
            //Handling comments here
            if (isBlockComment && buffer == '*') {
                continue;
            }
            if (handleComments(buffer) || isBlockComment) {
                buffer = "";
                break;
            }

            //Skip on cases not yet covered yet
            if (isNotCovered(buffer)) {
                buffer = "";
                break;
            }

            if (currentState == stateEnum.DEFAULT) {
                buffer = findBufferState(buffer);
            } else {
                buffer = evalState(buffer);
            }        
        }
        resolveState(buffer);
    }

    masterRep.push([lineNumber, currentLineRep]);
    postInterpretCleanup();
}


// Beginning basic comment support
function handleComments(buffer) {

    if (buffer == "//") {
        return true;
    }

    if (buffer == "/*") {
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
function postInterpretCleanup() {
    currentLineRep = [];
    currentDataHold = null;
}


function resolveState(buffer) {

    if (buffer == "") {
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
            currentDataHold.value = buffer;
            currentState = stateEnum.DEFAULT;
            break;
    }
}

//If we believe we did not catch var but think there is a variable check it
function noKeywordVariable(buffer) {

    currentDataHold = new Variable();
    if (buffer.includes("=")) {
        // We can assume there is something on the other side of
        // the '=' or else we would have a syntax error
        buffer = buffer.split("=");
        if (!isNaN(parseInt(buffer[0]))) {
            return;
        }
        
        currentDataHold.name = buffer[0];
        currentDataHold.value = buffer[1];

    } else {
        // We do not need to parse buffer since we already did before falling
        // falling into this method, and we know there is no '=' in the buffer
        currentDataHold.name = buffer;
    }

    currentLineRep.push(currentDataHold);
}


// Boolean function to determine if we should treat default state as variable
// May not need this if there are not many cases
function shouldBeVariable(buffer) {

    var isVar = true;

    if (!isNaN(parseInt(buffer))) {
        isVar = false;
    }

    return isVar;
}

// Band Aid for things not yet covered
function isNotCovered(buffer) {

    var isNotCovered = false;

    if (buffer.includes("function")) {
        isNotCovered = true;
    } else if (buffer.includes("console")) {
        isNotCovered = true;
    } else if (buffer.includes("{")) {
        isNotCovered = true;
    } else if (buffer.includes("}")) {
        isNotCovered = true;
    } else if (buffer.includes("()")) {
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
    }
    return buffer;
}

// If we are in accepting_var state
function acceptingVar(buffer) {

    if (buffer[buffer.length - 1] == '=') {
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
            currentLineRep.push(currentDataHold);
            return "";
            break;
        default:
            currentState = stateEnum.DEFAULT;
            break;
    }

    return buffer;
}

// Global evaluate function called on the step and run click
function evaluate(inputCode) {
    
    if (!setup(inputCode)) {
        return false;
    }    

    //While we haven't evaluated all of our code
    while (currentStep < userCode.length - 1) {
        interpretLine(currentStep);
        currentStep += 1;
    }

    masterRepToString(masterRep);
    exitInterpret();
    return masterRep;
}

// Print out our representation
function masterRepToString(representation) {

    for (var i = 0; i < representation.length; i++) {

        console.log("Line Number: " + representation[i][0]);
        for (var j = 0; j < representation[i][1].length; j++) {            
            console.log(JSON.stringify(representation[i][1][j]));
        }
    }
}

var code = `function helloWorld() {
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
            }`;
evaluate(code);
