# Project IVI
## Ivy Development Team

Interactive Visual Interpreter is meant to help beginner CS students understand their code better. The student enters code in the "Editor" and sees an abstract visual representation in the "Visualizer", while code results are logged to the "Console". The "Navbar" and "Step" button provide a way to walk through your code more slowly - like a debugger. 

### Install  

To view our prototype, clone and enter the following repo:
```
git clone git@github.com:project-ivi/ivi.git
cd ivi
```
Then install and build the sources.
```
npm install
npm run build
```
IVI is now built. 

### Run  

To run IVI, first install a server. I like [http-server](https://github.com/indexzero/http-server)
```
npm install http-server -g
```
Once you have a server, change into the `build/` directory and start your server.
```
cd build
http-server
```
Now open your broswer to `localhost:8080` (this port number might be different for your local server) and viola! You're seeing our IVI mock-up

