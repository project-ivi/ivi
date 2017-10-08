import React from 'react'

import { evaluate, } from '../interpreter/executor/interpret'
import { putInterpreterStep, clearSketchState, } from './visualizer/state'

import Console from './console'
import Editor from './editor'
import Navbar from './navbar'
import Visualizer from './visualizer'

export default class Interpreter extends React.Component {
  constructor() {
    super()

    this.state = {
      autoStepInterval: null,
      code: '',
      isRunning: false,
      isSteppingAutomatically: false,
      interpreterSteps: [], 
    }

    this.evaluateCode = this.evaluateCode.bind(this)
    this.stepInterpreter = this.stepInterpreter.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.handleRunInterpreter = this.handleRunInterpreter.bind(this)
    this.handleStepInterpreter = this.handleStepInterpreter.bind(this)
  }

  evaluateCode() {
    return new Promise((resolve, failure) => {
      // Delete the sketch loaded on memory.
      clearSketchState()
  
      // Ideally this is constructed as a queue but because of JavaScript
      // limitations the default implementation is an O(n) operation on access,
      // so in order to increase performance we will reverse the list and use
      // pop() for O(1) operations.
      const steps = evaluate(this.state.code)
      steps.reverse()
      this.setState({ isRunning: true, interpreterSteps: steps, })
      resolve()
    })
  }

  stepInterpreter() {
    const newState = this.state.interpreterSteps.slice(0)
    const elem = newState.pop()
    
    if (!elem) {
      clearInterval(this.state.autoStepInterval)
      this.setState({ autoStepInterval: null, isRunning: false, })

    } else {
      // Update the Sketch state with access function.
      putInterpreterStep(elem)

      this.setState({ interpreterSteps: newState, })
      return true
    }
  }

  handleCodeChange(editorValue, event) {
    if (!this.state.isRunning) this.setState({ code: editorValue, })
  }

  handleRunInterpreter() {
    if (!this.state.isRunning) {
      this.evaluateCode()
      .then(() => {
        this.stepInterpreter()

        const interval = setInterval(() => {
          this.stepInterpreter()
        }, 1000)
        
        this.setState({ autoStepInterval: interval, isSteppingAutomatically: true, })
        
      })
      .catch(error => console.log('Error on handleRunInterpreter: ' + error))
    }
  }

  handleStepInterpreter() {
    if (!this.state.isRunning) {
      this.evaluateCode()
      .then(() => { this.stepInterpreter() })
      .catch(error => console.log('Error on handleStepInterpreter: ' + error))

    } else {
      clearInterval(this.state.autoStepInterval)
      this.setState({ autoStepInterval: null, })
      this.stepInterpreter()
    }
  }

  render() {
    return (
      <div className="main-view" >
        <div style={{height: '100%'}}>
          <div style={{float: 'left', width: '50%', height: '100%', paddingRight: '15px'}}>
            <div style={{height: '7%'}}>
              <Navbar code={ this.state.code }
                      handleRun={ this.handleRunInterpreter }
                      handleStep={ this.handleStepInterpreter } />
            </div>
            <div style={{height: '93%', paddingTop: '15px'}}>
              <Editor isRunning={ this.state.isRunning }
                      code={ this.state.code }
                      handleCodeChange={ this.handleCodeChange } />
            </div>
          </div>
          <div style={{float: 'right', width: '50%', height: '100%'}}>
            <div style={{height: '70%'}}>
              <Visualizer />
            </div>
            <div style={{height: '30%', paddingTop: '15px'}}>
              <Console />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
