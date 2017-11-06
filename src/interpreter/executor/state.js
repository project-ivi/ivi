export let state = {};
export let log = [];
let symbolTable = {0 : {}};
export let currScope = symbolTable[0];
export let scope = [0];
export let scopeLevel = 0;

export function resetState() {
  log = [];
  scope = [0];
  scopeLevel = 0;
  symbolTable = {0: {}};
  currScope = symbolTable[0];

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

function traverseToScope() {

  let newScope = symbolTable;
  for (let i = 0; i < scopeLevel + 1; i++) {
    newScope = newScope[scope[i]];
  }
  return newScope;
}

export function insertVar(variable) {
    traverseToScope()[variable.name] = variable.value;
}

export function getClosestValue(varName) {
  let closest = undefined;
  let currentScope = symbolTable;
  for (let i = 0; i < scopeLevel + 1; i++) {
    if (currentScope[varName] !== undefined) {
      closest = currentScope[varName];
    }
    currentScope = currentScope[scope[i]];
  }
  return String(closest);
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
