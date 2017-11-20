import React from 'react';

import { submitCode, nextStep, resetInterpreter, getLog } from '../interpreter/executor';

import Console from './console';
import Editor from './editor';
import Navbar from './navbar';
import Visualizer from './visualizer';

const AUTOSTEP_INTERVAL_IN_MS = 1;

export default class Interpreter extends React.Component {
  constructor() {
    super();

    this.state = {
      autoStepInterval: null,
      code: '',
      isRunning: false,
      isSteppingAutomatically: false,
      currentStep: 0,
    };

    this.evaluateCode = this.evaluateCode.bind(this);
    this.stepInterpreter = this.stepInterpreter.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleRunInterpreter = this.handleRunInterpreter.bind(this);
    this.handleStepInterpreter = this.handleStepInterpreter.bind(this);
  }

  evaluateCode() {
    return new Promise(resolve => {
      // Clear state loaded.
      resetInterpreter();

      if (submitCode(this.state.code)) {
        this.setState({
          isRunning: true,
          currentStep: 0,
        });
      }

      resolve();
    });
  }

  stepInterpreter() {
    if (!nextStep()) {
      // If nextStep returns false, that means the program has concluded.
      // Stop the autorunner if there is one active, and mark the interpreter as
      // not running.
      clearInterval(this.state.autoStepInterval);
      this.setState({ autoStepInterval: null, isRunning: false });
      return false;
    }

    this.setState({ currentStep: this.state.currentStep + 1 });
    return true;
  }

  handleCodeChange(editorValue) {
    if (!this.state.isRunning) this.setState({ code: editorValue });
  }

  handleRunInterpreter() {
    // If the user is starting from edit-mode to run, get the output of the
    // program first, then start the automation.
    if (!this.state.isRunning) {
      this.evaluateCode()
        .then(() => {
          this.stepInterpreter();

          const interval = setInterval(() => {
            this.stepInterpreter();
          }, AUTOSTEP_INTERVAL_IN_MS);

          this.setState({
            autoStepInterval: interval,
            isSteppingAutomatically: true,
          });
        })
        .catch(error => {
          console.log('Error on handleRunInterpreter');
          console.log(error);
        });

    } else {
      // If the user is beginning to step through the interpreter
      if (!this.state.isSteppingAutomatically) {
        this.stepInterpreter();

        const interval = setInterval(() => {
          this.stepInterpreter();
        }, AUTOSTEP_INTERVAL_IN_MS);

        this.setState({
          autoStepInterval: interval,
          isSteppingAutomatically: true,
        });

      } else {
        // If the user is already running automatically, cancel the existing one.
        clearInterval(this.state.autoStepInterval);
        this.setState({
          autoStepInterval: null,
          isSteppingAutomatically: false,
        });
      }
    }
  }

  handleStepInterpreter() {
    // If the user is starting from edit-mode to step, get output of the
    // program first.
    if (!this.state.isRunning) {
      this.evaluateCode()
        .then(() => {
          this.stepInterpreter();
        })
        .catch(error => {
          console.log('Error on handleStepInterpreter: ');
          console.log(error);
        });

    } else {
      // If the user is running the interpreter automatically and want to step,
      // remove the interval for automating step.
      clearInterval(this.state.autoStepInterval);
      this.setState({
        autoStepInterval: null,
        isSteppingAutomatically: false,
      });
      this.stepInterpreter();
    }
  }

  render() {
    /* break down the interpreter state for the components
      0 - stopped
      1 - step mode
      2 - run mode
    */
    let runMode;
    if (this.state.isRunning) {
      if (this.state.isSteppingAutomatically) {
        runMode = 2;
      } else {
        runMode = 1;
      }
    } else {
      runMode = 0;
    }

    return (
      <div className='main-view' >
        <div style={{ height: '100%' }}>
          <div style={{ float: 'left', width: '50%', height: '100%', paddingRight: '15px' }}>
            <div style={{ height: '70px' }}>
              <Navbar code={ this.state.code }
                runMode={ runMode }
                handleRun={ this.handleRunInterpreter }
                handleStep={ this.handleStepInterpreter } />
            </div>
            <div style={{ height: 'calc(100% - 70px)', paddingTop: '15px' }}>
              <Editor isRunning={ this.state.isRunning }
                highlightedLine={ this.state.currentStep }
                code={ this.state.code }
                handleCodeChange={ this.handleCodeChange } />
            </div>
          </div>
          <div style={{ float: 'right', width: '50%', height: '100%' }}>
            <div style={{ height: '70%' }}>
              <Visualizer />
            </div>
            <div style={{ height: '30%', paddingTop: '15px' }}>
              <Console consoleOutput={ getLog() } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
