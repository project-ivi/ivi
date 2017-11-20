/*
    This file's purpose is solely to finish 442 with conditionals.
    This code is not good and should not be kept outside the scope 
    of the class.  This is made as a result of a tight deadline.
*/

import { getClosestValue } from './state.js';
import { deriveType } from './util.js';
import { typeEnum } from './enums.js';

export class Conditional {
  constructor() {
    this.possibilities =  [];
    this.chosen = -1;
    this.text = '';
    this.scope = null;
  }
}

let conditionals = {};

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
              let firstParen = inputCode.indexOf('(', i);
              if (inputCode.indexOf('{', i) > firstParen) {
                let firstBrace = inputCode.indexOf('{', firstParen);
                let closingParen = inputCode.lastIndexOf(')', firstBrace);
                let con = inputCode.substring(firstParen + 1, closingParen);
                currCon.possibilities.push(con);
              }
              continue;
            } else if (inputCode.indexOf('if', i) === -1) {
              continue;
            }
          }
          currCon.text = buffer;
          let elseStatement = '!(';
          for (let i = 0; i < currCon.possibilities.length; i++) {
            elseStatement += currCon.possibilities[i] + ' || ';
          }
          elseStatement = elseStatement.substring(0, elseStatement.length - 4);
          elseStatement += ')';
          currCon.possibilities.push(elseStatement);

          indexToConditional[semiColonCount] = currCon;

          semiColonCount += 1;
          inConditional = false;
          buffer = '';
          scopeLevel = 0;
          currCon = null;
          continue;
        }
      }

    } else {
      if (!inString) {
        if (currChar === '\'') {
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
        currCon = new Conditional();

        // Grab if conditional
        let firstParen = inputCode.indexOf('(', i);
        let firstBrace = inputCode.indexOf('{', firstParen);
        let closingParen = inputCode.lastIndexOf(')', firstBrace);
        let con = inputCode.substring(firstParen + 1, closingParen);
        currCon.possibilities.push(con);

      } else if (currChar !== 'f' && buffer.length > 0) {
        buffer = '';
      }
    }
  }
  return indexToConditional;
}

export function filterOutConditionals(inputCode) {

  let toRemove = preParse(inputCode);
  for (let key in toRemove) {
    inputCode = inputCode.replace(toRemove[key].text, '');
  }
  conditionals = toRemove;
  return inputCode;
}

export function reInsertConditionals(splitCode) {
  for (let key in conditionals) {
    splitCode.splice(key, 0, conditionals[key]);
  }
  return splitCode;
}

export function handleWinner(con) {
  for (let i = 0; i < con.possibilities.length - 1; i++) {
    let val = getClosestValue(con.possibilities[i]);
    if (con.possibilities[i] === 'true' || val === 'true'
        || deriveType(val) === typeEnum.NUMBER && val != '0') {
      con.chosen = i;
      break;
    }
  }
  if (con.chosen === -1) {
    con.chosen = con.possibilities.length - 1;
  }
  return getBranchSplit(con);
}

function getBranchSplit(con) {

  let buffer = '';
  let scopeLevel = 0;
  let branch = -1;
  let isCapture = false;
  for (let i = 0; i < con.text.length; i++) {
    let currChar = con.text[i];
    if (currChar === '{') {
      scopeLevel += 1;
      if (scopeLevel === 1) {
        branch += 1;
      }
    } else if (currChar === '}') {
      scopeLevel -= 1;
    }
    if (branch === con.chosen) {
      isCapture = true;
    }

    if (isCapture) {
      buffer += currChar;

      if (scopeLevel === 0) {
        break;
      }
    }
  }
  buffer = filterOutConditionals(buffer);
  buffer = buffer.split(/;/);
  return reInsertConditionals(buffer);
}
