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

//List to hold variables in the case of multi variable declarations
var currentVariables = [];

var masterNameList = [];

// Current interpreter state for program
var currentState = stateEnum.DEFAULT;

// Current step in the user input code
var currentStep = -1;

// Current object we are adding data to
var currentDataHold = null;

//  Flag to tell code editor to be writable or not
var isRunning = false;

//  List to hold user code, use a list so we can index on stepCount
var userCode = []

// Setup for when we initially call evaluate
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

    currentState = stateEnum.DEFAULT;
    currentStep = -1;
    isRunning = false;
    userCode = [];
    currentDataHold = null;
    currentVariables = [];
}

function interpretLine(lineNumber) {

    var codeLine = userCode[lineNumber];
    var buffer = '';

    // Iterate each character in the current user code line
    for (var i = 0; i < codeLine.length; i++) {
        if (codeLine[i] == ' ') {
            continue;
        }

        buffer += codeLine[i]

        if (currentState == stateEnum.DEFAULT) {
            buffer = findBufferState(buffer);
        } else {
            evalState(buffer);
        }
    }

}

function evalState(buffer) {

    switch (currentState) {
        
        //We should not ever hit this case but let's put it in here just in case
        case stateEnum.DEFAULT:
            findBufferState(buffer);
            break;

        case stateEnum.ACCEPTING_VAR:
            acceptingVar(buffer);
            break;
    }
}

function acceptingVar(buffer) {

    if (buffer[buffer.length - 1] == '=' 
        || (currentDataHold.name == "" && buffer[buffer.length - 1] == ';')) {
        currentDataHold.name = buffer.substring(0, buffer.length - 3);
        if (buffer[buffer.length - 1] == ';') {
            currentState = stateEnum.DEFAULT;
        }
        masterNameList.push(buffer.substring(0, buffer.length - 3));
    }

}

//Evaluate our buffer to try to find a state
function findBufferState(buffer) {

    switch (buffer) {
        case "var":
            currentState = stateEnum.ACCEPTING_VAR;
            currentDataHold = new Variable();
            currentVariables = [];
            currentVariables.push(currentDataHold);
            return "";
            break;
        default:
            currentState = stateEnum.DEFAULT;
            break;
    }

    return buffer;
}

//Global evaluate function called on the step and run click
function evaluate(inputCode, isStep) {
    
    if (currentStep == -1) {
        if (!setup(inputCode)) {
            return false;
        }
    }
    
    // Bump up our step no matter what
    currentStep += 1;

    // If run is hit interpret the entire input code
    if (!isStep) {

        //While we haven't evaluated all of our code
        while (currentStep < userCode.length - 1) {
            interpretLine(currentStep);
            currentStep += 1;
        }
        console.log(masterNameList);
        exitInterpret();
        return true;
    }

    exitInterpret();
    return true;
}

var code = `function helloWorld() {
                var x=2;
                var y = 3;
                var n;
                console.log('hello');
            }`;
evaluate(code, false);
