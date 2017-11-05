// Class representing console output
class Console {
  constructor() {
    this.output = '';
  }
}

// Class representing basic expression
class Expression {
  constructor(derivedFrom) {
    this.numLines = 0;
    this.data = null;
    this.derivedFrom = derivedFrom;
  }
}

// Class representing syntax error
class Syntax {
  constructor() {
    this.caughtText = '';
    this.lineNum = '';
  }
}

// Class representing unsupported code
class Unsupported {
  construcor() {
    this.value = '';
    this.lineNum = '';
  }
}

// Class representing a variable
class Variable {
  constructor() {
    this.name = '';
    this.value = 'undefined';
    this.inferredType = '';
  }
}

export {
  Console,
  Expression,
  Syntax,
  Unsupported,
  Variable,
};
