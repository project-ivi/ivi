import { scope, scopeLevel } from './state';

// Class representing console output
export class Console {
  constructor() {
    this.output = '';
  }
}

// Class representing basic expression
export class Expression {
  constructor(derivedFrom) {
    this.numLines = 0;
    this.data = null;
    this.derivedFrom = derivedFrom;
  }
}

// Class representing syntax error
export class Syntax {
  constructor(error) {
    this.value = 'Syntax error caused by: ' + error;
    this.lineNum = '';
  }
}

// Class representing unsupported code
export class Unsupported {
  constructor(error) {
    this.value = 'Unsupported: ' + error;
    this.lineNum = '';
  }
}

// Class representing a variable
export class Variable {
  constructor() {
    this.name = '';
    this.value = 'undefined';
    this.inferredType = '';
    this.scope = scope.slice(0, scopeLevel + 1);
  }
}
