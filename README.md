# Project IVI | Ivy Development Team

Interactive Visual Interpreter is meant to help beginner CS students understand their code better. The student enters code in the "Editor" and sees an abstract visual representation in the "Visualizer", while code results are logged to the "Console". The "Navbar" and "Step" button provide a way to walk through your code more slowly - like a debugger. 

## Using
### Install  
Our project requires `git`, `npm`&`node`. It will be easier on a unix-like system. For Windows we recomend using [git bash](https://git-for-windows.github.io/).

To view our prototype, clone and enter the following repo:
```
git clone git@github.com:project-ivi/ivi.git
cd ivi
```
Install the dependencies:
```
npm install
```
When the npm install process completes, run the following:
```
cd semantic && gulp build
```

Now build the source files:
```
cd ..
npm run build
```
IVI is now built. 

### Run  

`npm start` will run the dev server and open your browser. 

## Features
### Supported  
Currently IVI only handles variable processing and is relatively basic.
- Variable declaration
- Assigning strings
- Assigning numbers
- Assigning to other variable's values
- Printing to console 

### Unsupported
- Obscure Variable Declaration methods
  - `var a,b = 2,3`
  - multi line assignment
    ```
    var a
    =
    5
    ```
  - `x = y = 5`
- Control flow
- Math
- Functions
- Everything else not listed in 'Supported'


