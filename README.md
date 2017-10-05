# Project IVI
## Ivy Development Team

Interactive Visual Interpreter is meant to help beginner CS students understand their code better. The student enters code in the "Editor" and sees an abstract visual representation in the "Visualizer", while code results are logged to the "Console". The "Navbar" and "Step" button provide a way to walk through your code more slowly - like a debugger. 

### Install  

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
