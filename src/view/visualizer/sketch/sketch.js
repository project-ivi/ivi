import { getSketchState, } from '../state'
import Scope from './components/scope'
import Variable from './components/variable'


export default p => {

    p.setup = () => {
        p.createCanvas(0, 0)
        p.background('white')
        p.noStroke()
        resizeCanvasToVisualizer()
    }

    function resizeCanvasToVisualizer() {
        const elem = document.getElementById('visualizer')
        p.resizeCanvas(elem.offsetWidth, elem.offsetHeight)
    }

    p.draw = () => {
        p.background('white')

        const s = new Scope(p);
        const v = new Variable(p);
        s.draw();
        v.draw();
    }

    p.windowResized = () => {
        resizeCanvasToVisualizer()
        // overflow = false
        p.background('white')
        // reDrawKnown()
      }

}