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

### Linting

To lint your code use `npm run lint`. This will report attempt to fix any issues (such as improper indentation) and report any non-fixable errors. Use `npm run lint-w` to watch code for linting errors. Using watch option will re-lint on any save.

## Features  
Code input must be Javascript
### Supported  
Currently IVI is basic but is quickly expanding
We support the types:
-Number
-String
-Boolean
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
- Multiplication
- Division
- Modulo
- Scoping through plain braces
- Multiline statements
- Conditional statements (ex: if, else if, else) as well as nesting statements
- Simple comparators (ex: < and >)

# Notes: 
- In order to use conditionals you must make a variable that holds a boolean value.  You can have your conditional statement set to the variable and then that variable ONLY will be put in the parenthesis for the conditional.
For example:   
```
 var a = 5 < 3;
 var b = 6 > 7;
 var c = false;
 if (a) {
 
 } else if (b) {
 
 } else if (c) {
 
 } else {
 
 }   
 ```
- Order of operations is not yet supported.  Evaluation will happen right to left which makes some complex math operations unsupported.

### Unsupported
- Using `NaN` or `unsupported` as variable names.
- Order of operations, the program will recurse to the end of the line then pass values up backwards
- Some console log edge cases ex: `console.log(1 + 2 + 'hello');` will log 12hello because we promote everything to a string first since we are passing values up from the end
- Adding with negative number, we allow subtraction but adding negative numbers not supported
- Looping
- Comparators such as `&& || >= <= == ===` any comparator more than one charactor is not supported
- Multi - character arithmetic operations `+= *=`
- Bit Shifting
- Functions
- Everything else not listed in 'Supported'

### Syntax errors will output to console, unsupported features will also print to console with line numbers and text that caused them

## Statements Must End in Semi-Colons or Unpredictable behavior will happen
