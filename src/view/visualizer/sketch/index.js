import { getSketchState, } from '../state'

export default p => {

  let rectWidth = 80
  let rectHeight = 30
  class VariableRep {
      constructor() {
        this.color = ""
        this.highlight = false
        this.x = 0
        this.y = 0
        this.width = rectWidth
        this.height = rectHeight
        this.name = ""
        this.value = "undefined"
      }

      display() {
        p.push()
        p.fill(this.color)
        if (this.highlight) {
            p.stroke('black')
        } else {
            p.noStroke()
        }
        p.rect(this.x, this.y, this.width, this.height, 3)
        p.noStroke()
        p.fill('black')
        p.text(this.name, this.x + 6, this.y - 10)
        p.textStyle(p.BOLD)
        p.fill('white')
        p.text(this.value, this.x + 6, this.y + 20)
        p.pop()
      }
  }

  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer')
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight)
  }
 
  let known = {}
  let objs = []
  let overflow = false;
  p.setup = () => {
    p.createCanvas(0, 0)
    p.background('white')
    p.noStroke()
    resizeCanvasToVisualizer()
  }

  p.draw = () => {
    if (overflow) {
        p.background('white')
        p.fill('red')
        p.text("Canvas Too Small for Amount of Data", p.width / 2, p.height / 2)
        return
    }

    const state = getSketchState()
    if (Object.keys(state).length < objs.length) {
        known = {}
        objs = []
        rectWidth = 80
        overflow = false
        p.background('white')
    }

    let xCoord = 50
    let yCoord = 0
    let curObj = -1
    let changeWidth = false;
    Object.keys(state).forEach((val, i) => {
      curObj += 1
      yCoord = (rectHeight * 2) * curObj + rectHeight

      if (yCoord > p.height - (rectHeight + 15)) {
        yCoord = rectHeight
        xCoord += rectWidth + 20
        curObj = 0
      }
      if (xCoord > p.width - (rectWidth + 20)) {
          overflow = true
          return
      }

      if (known[val] === undefined || known[val] !== state[val]) {
        p.background('white')
        let fillColor = getColor(Math.floor(Math.random() * 11) + 1)
        let update = known[val] !== undefined && known[val] !== state[val]
        if (p.textWidth(val) > rectWidth) {
            rectWidth = p.textWidth(val) + 15
            changeWidth = true
        } else if (p.textWidth(state[val]) > rectWidth) {
            rectWidth = p.textWidth(state[val]) + 50
            changeWidth = true
        }
        
        if (!update) {
            let newObj = new VariableRep()
            newObj.x = xCoord
            newObj.y = yCoord
            newObj.color = fillColor
            newObj.highlight = true
            newObj.name = val
            newObj.value = state[val]
            newObj.display()
            objs.push(newObj)
        }

        if (changeWidth) {
            p.background('white')
            reDrawKnown()
        }

        objs.forEach(function(variable) {
            if (update && variable.name === val) {
                variable.highlight = true
                variable.color = fillColor
                console.log(state[val])
                variable.value = state[val]
            } else {
                variable.highlight = false;
            }
            variable.width = rectWidth
            variable.height = rectHeight
            variable.display()
        })

        known[val] = state[val]
      }
    })
  }

  p.windowResized = () => {
    resizeCanvasToVisualizer()
    overflow = false
    p.background('white')
    reDrawKnown()
  }
  
  function reDrawKnown() {
    let xCoord = 50
    let yCoord = 0
    let curObj = -1
    objs.forEach(function(variable) {
      variable.width = rectWidth
      variable.height = rectHeight
      curObj += 1
      yCoord = (rectHeight * 2) * curObj + rectHeight

      if (yCoord > p.height - (rectHeight + 15)) {
        yCoord = rectHeight
        xCoord += rectWidth + 20
        curObj = 0
      }
      if (xCoord > p.width - (rectWidth + 20)) {
          overflow = true
          return
      }
      variable.x = xCoord
      variable.y = yCoord
      variable.display()
    })
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
