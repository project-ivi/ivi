import { getSketchState, } from '../state'

export default p => {
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
    let xCoord = 15
    let yCoord = 0
    let curObj = -1
    Object.keys(state).forEach((val, i) => {
      curObj += 1
      yCoord = 60 * curObj + 30

      if (yCoord > p.height - 45) {
          yCoord = 30
          xCoord += 100
          curObj = 0
      }

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
