// This is our 'state' when interpreting the code
//  Use this enum as a flag for certain logic
export const stateEnum = {
  DEFAULT: 'default',
  ACCEPTING_VAR: 'accepting variable',
  ASSIGNING_VAR: 'assigning variable',
  ACCEPTING_CONSOLE: 'accepting console',
  CONSUMED: 'consumed',
};

// This is our enum for data types for variables
export const typeEnum = {
  BOOLEAN: 'boolean',
  NAN: 'NaN',
  NUMBER: 'number',
  STRING: 'string',
  UNDEFINED: 'undefined',
};

// This is our enum for operations
export const operationsEnum = {
  ADDITION: '+',
  ASSIGNMENT: '=',
  DIVISION: '/',
  GROUPING_START: '(',
  GROUPING_END: ')',
  REMAINDER: '%',
  LOGICAL_NOT: '!',
  MULTIPLICATION: '*',
  SUBTRACTION: '-',
};

export const symbolsEnum = {
  FALSE: 'false',
  NAN: 'NaN',
  STRING_DOUBLE_QUOTE: '"',
  STRING_SINGLE_QUOTE: '\'',
  TRUE: 'true',
  UNDEFINED: 'undefined',
};
