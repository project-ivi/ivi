// This is our 'state' when interpreting the code
//  Use this enum as a flag for certain logic
const stateEnum = {
  DEFAULT : "default",
  ACCEPTING_VAR : "accepting variable",
  ASSIGNING_VAR : "assigning variable",
  ACCEPTING_CONSOLE : "accepting console",
  CONSUMED : "consumed"
}

// This is our enum for data types for variables
const typeEnum  = {
  STRING : "string",
  NUMBER : "number",
  UNDEFINED : "undefined"
}

export {
  stateEnum,
  typeEnum,
}