import { getSketchState, } from '../state'

export default p => {
  // Used for drawing variable boxes
  // Set to negative due to issues with incrementing in mousePressed() funct
  let xCoord = -60
  let yCoord = 30
  let boxCount = 0

  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer')
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight)
  }
  
  p.setup = () => {
    p.createCanvas(0, 0)
    resizeCanvasToVisualizer()
  }

  p.draw = () => {
  	// Background and box same color to give outlined effect
    p.background('white')

    const state = getSketchState()
    Object.keys(state).forEach((val, i) => {
      const xCoord = 15
      const yCoord = 60 * i + 30

      p.stroke('black')
      p.fill('white')
      p.rect(xCoord, yCoord, 80, 30, 3)

      p.fill('black')
      p.text(val, xCoord + 6, yCoord - 10)
      p.text(state[val], xCoord + 6, yCoord + 20)  
    })
  }

  p.windowResized = () => {
    resizeCanvasToVisualizer()
  }
}