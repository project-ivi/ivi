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
  STRING: 'string',
  NUMBER: 'number',
  UNDEFINED: 'undefined',
  NAN: 'NaN',
  BOOLEAN: 'boolean',
};

// This is our enum for operations
export const operationsEnum = {
  ADDITION: '+',
  DIVISION: '/',
  REMAINDER: '%',
  MULTIPLICATION: '*',
  SUBTRACTION: '-',
};
