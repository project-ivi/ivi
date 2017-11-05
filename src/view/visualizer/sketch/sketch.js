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
        s.x = 10; s.y = 10; 
        s.width = p.width - 20; s.height = p.height - 20;
        s.child = new Scope(p);
        s.child.child = new Scope(p);

        for (let i = 0; i < 15; i++) {
            s.variables.push(new Variable(p))
        }
        for(let i = 0; i < 6; i++) {
            s.child.variables.push(new Variable(p));
        }
        for(let i = 0; i < 20; i++) {
            s.child.child.variables.push(new Variable(p))
        }
        s.draw();

        // THIS NEEDS TO BE APPLIED TO EVERY SCOPE
        s.mouseHover(p.mouseX, p.mouseY)
        s.child.mouseHover(p.mouseX, p.mouseY)
        s.child.child.mouseHover(p.mouseX, p.mouseY)
        
        
    }

    p.windowResized = () => {
        resizeCanvasToVisualizer()
        // overflow = false
        p.background('white')
    }
    

}