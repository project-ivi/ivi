import { getSketchState, } from '../state'
import Scope from './components/scope'
import { Variable } from './components/variable'


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
        s.x = 20; s.y = 20; 
        s.width = p.width - 40; s.height = p.height - 40;
        s.child = new Scope(p);
        s.child.child = new Scope(p);

        for (let i = 0; i < 20; i++) {
            s.variables.push(new Variable(p))
            s.child.variables.push(new Variable(p))
            s.child.child.variables.push(new Variable(p))
        }
        s.draw();
    }

    p.windowResized = () => {
        resizeCanvasToVisualizer()
        // overflow = false
        p.background('white')
      }

}