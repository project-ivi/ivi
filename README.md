# Project IVI | Ivy Development Team

Interactive Visual Interpreter is meant to help beginner CS students understand their code better. The student enters code in the "Editor" and sees an abstract visual representation in the "Visualizer", while code results are logged to the "Console". The "Navbar" and "Step" button provide a way to walk through your code more slowly - like a debugger. 

## Using
### Install  
Our project requires `git`, `npm`&`node`. Node should be version 8, NPM version 5. It will be easier on a unix-like system. For Windows we recomend using [git bash](https://git-for-windows.github.io/).

To view our prototype, clone and enter the following repo:
```
git clone git@github.com:project-ivi/ivi.git
cd ivi
```
Install the dependencies:
```
npm install
```
Now build IVI
```
npm run build
```
IVI is now built. 

### Run  

`npm start` will run the dev server and open your browser. 

### Linting and Testing

To lint your code use `npm run lint`. This will report attempt to fix any issues (such as improper indentation) and report any non-fixable errors. Use `npm run lint-w` to watch code for linting errors. Using watch option will re-lint on any save.

To run tests use `npm run test`. If you'd like to keep the test runner open use  `npm run test-w`. the `-w` is for "watch". Using the watch option will cause tests to reevaluate given any changes to test code.

## Features
### Supported  
Currently IVI is basic but is quickly expanding
We support the types:
-Number
-String
-undefined
-NaN

We support:
- Chained statements ex: `a=b=c=4;`, `console.log(console.log(console.log('test')));`
- Variable declaration
- Variable Assignment
- Assigning to other variable's values
- Printing to console
- Comments in Code
- Addition
- Subtraction
- Scoping through plain braces
- Multiline statements

### Unsupported
- Control flow
- Functions
- Everything else not listed in 'Supported'

### Syntax errors will output to console, unsupported features will also print to console with line numbers and text that caused them

## Statements Must End in Semi-Colons or Unpredictable behavior will happen
