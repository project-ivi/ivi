export default p => {
  const gray = 150

  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer')
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight)
  }
  
  p.setup = () => {
    p.createCanvas(0, 0)
    resizeCanvasToVisualizer()
  }

  p.draw = () => {
    p.background(0, gray, 0)
    p.rect(p.width/2, p.height/2, 100, 100)
  }

  p.windowResized = () => {
    resizeCanvasToVisualizer()
  }
}