import { getSketchState, } from '../state'

export default p => {
 
  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer')
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight)
  }
 
  let objState = {}
  let colorState = 0
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
      if (objState[val] === undefined) {
        colorState === 11 ? colorState = 0 : colorState += 1
        let fillColor = getColor(colorState)

        p.stroke('black')
        p.fill(fillColor)
        p.rect(xCoord, yCoord, 80, 30, 3)

        p.fill('black')
        p.text(val, xCoord + 6, yCoord - 10)
        p.text(state[val], xCoord + 6, yCoord + 20)  
      }
    })
    objState = state;
  }

  p.windowResized = () => {
    resizeCanvasToVisualizer()
  }

  function getColor(colorState) {
    switch(colorState) {
        case 0:
            return '#00c9fe'
        case 1:
            return '#00d4df'
        case 2:
            return '#00dab4'
        case 3:
            return '#ffb5b4'
        case 4:
            return '#ff96b4'
        case 5:
            return '#0096b4'
        case 6:
            return '#0069fb'
        case 7:
            return '#af96fb'
        case 8:
            return '#ff8b6a'
        case 9:
            return '#ffbf00'
        case 10:
            return '#ff00c3'
        case 11:
            return '#0000c3'
        default:
            return '#00c9fe'
    }
  }
}
