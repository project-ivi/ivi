/*
    This file's purpose is solely to finish 442 with conditionals.
    This code is not good and should not be kept outside the scope 
    of the class.  This is made as a result of a tight deadline.
*/
class conditional {
    constructor() {
        this.possibilities =  [];
        this.chosen = -1;
    }
}

function preParse(inputCode) {

    let indexToConditional = {};

    let stringStart = '';
    let inString = false;

    let semiColonCount = 0;
    let inConditional = false;

    let scopeLevel = 0;

    let buffer = '';

    let currCon = null;
    for (let i = 0; i < inputCode.length; i++) {
        let currChar = inputCode[i];
        if (inConditional) {

            buffer += currChar;
            if (currChar === '{') {
                scopeLevel += 1;
            } else if (currChar === '}') {
                scopeLevel -= 1;
                if (scopeLevel === 0) {  
                    if (inputCode.indexOf('else', i) !== -1) {
                        if (inputCode.indexOf('if', i) !== -1
                            && inputCode.indexOf('if', i) > inputCode.indexOf('else', i)) {
                            continue;
                        } else if (inputCode.indexOf('if', i) === -1) {
                            continue;
                        }
                    }
                    indexToConditional[semiColonCount] = buffer;

                    semiColonCount += 1;
                    inConditional = false;
                    buffer = '';
                    scopeLevel = 0;
                    continue;
                }
            }

        } else {
            if (!inString) {
                if(currChar === '\'') {
                    stringStart = '\'';
                    inString = true;
                } else if (currChar === '"') {
                    stringStart = '"';
                    inString = true;
                }
            } else if (inString) {
                if (currChar === '\'' && stringStart === '\'') {
                    inString = false;
                } else if (currChar === '"' && stringStart === '"') {
                    inString = false;
                }
            }
    
            if (inString) {
                continue;
            }
    
            if (currChar === ';') {
                semiColonCount += 1;
                continue;
            }
            if (currChar === 'i') {
                buffer += currChar;
            } else if (currChar === 'f' && buffer === 'i') {
                buffer += currChar;
                inConditional = true;
            } else if (currChar !== 'f' && buffer.length > 0) {
                buffer = '';
            }
        }
    }
    return indexToConditional;
}



let testCode = `
                var a = 2;
                if (a < b) {


                    if (c < d) {


                    } else {

                        var n = 3;
                    }
                } else if (test) {


                    var q = 2;
                } else {


                    var qqq = 'test';
                }


                if (a < b) {


                    if (c < d) {


                    } else {

                        var n = 3;
                    }
                } else if (test) {


                    var q = 22222;
                } else {


                    var qqq = 'test2';
                }

                var z = 'woo';
                `;
console.log(JSON.stringify(preParse(testCode)));
