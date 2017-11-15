export let state = {};
export let log = [];
let symbolTable = {0 : {}};
export let currScope = symbolTable[0];
export let scope = [0];
export let scopeLevel = 0;
export let visualRep = [];
export let onChange = false;

export function resetState() {
  log = [];
  scope = [0];
  scopeLevel = 0;
  symbolTable = {0: {}};
  currScope = symbolTable[0];
  visualRep = [];
  onChange = false;

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      delete state[key];
    }
  }

  for (const key in state) {
    if (symbolTable.hasOwnProperty(key)) {
      delete symbolTable[key];
    }
  }
}


// Traverse to the dictionary of our new scope
// Used when we decrease scope because we have
// no easy way to go backwards
function traverseToScope() {

  let newScope = symbolTable[0];
  for (let i = 1; i < scopeLevel + 1; i++) {
    newScope = newScope[scope[i]];
  }
  return newScope;
}

// Insert a variable into the current scope
export function insertVar(variable) {
  currScope[variable.name] = variable.value;
}

export function getClosestValue(varName) {
  let currentScope = symbolTable[0];
  let closest = currentScope[varName];
  for (let i = 1; i < scopeLevel + 1; i++) {
    currentScope = currentScope[scope[i]];
    if (currentScope[varName] !== undefined) {
      closest = currentScope[varName];
    }
  }

  return String(closest);
}

//Intake scope arr and input into symbol table
export function insertAtScope(scopeArr, variable) {
  let currentScope = symbolTable[0];
  for (let i = 1; i < scopeArr.length; i++) {
    if (currentScope[scopeArr[i]] === undefined) {
      currentScope[scopeArr[i]] = {};
    }
    currentScope = currentScope[scopeArr[i]];
  }
  currentScope[variable.name] = variable.value;
  generateVisualRep(scopeArr);
  onChange = true;
}

export function generateVisualRep(scopeArr) {
  let newRep = [];
  let currentScope = symbolTable;
  for (let i = 0; i < scopeArr.length; i++) {
    newRep.push([]);
  }

  for (let i = 0; i < scopeArr.length; i++) {
    currentScope = currentScope[scopeArr[i]];
    for (let key in currentScope) {
      if (!(currentScope[key] instanceof Object)) {
        newRep[i].push([key, currentScope[key]]);
      }
    }
  }
  visualRep = newRep;
}

export function cancelChange() {
  onChange = false;
}

export function increaseScope() {
  scopeLevel += 1;
  if (scope.length < scopeLevel + 1) {
    scope.push(0);
  }

  scope[scopeLevel] += 1;

  currScope[scope[scopeLevel]] = {};
  currScope = currScope[scope[scopeLevel]];
}

export function decreaseScope() {
  scopeLevel -= 1;
  currScope = traverseToScope();
}
