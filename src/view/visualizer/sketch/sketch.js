import Scope from './components/scope';
import Conditional from './components/conditional';
import { Variable } from './components/variable';
import { VAR_WIDTH, VAR_HEIGHT } from './components/variable';
import { visualRep } from '../../../interpreter/executor/state';

let VARIABLES = [];
let base = null;

export default p => {

  p.setup = () => {
    p.createCanvas(0, 0);
    p.background('white');
    p.frameRate(20);
    p.noStroke();
    resizeCanvasToVisualizer();
  };

  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer');
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  }

  p.draw = () => {

    p.background('white');

    base = new Scope(p);
    base.width = p.width - 40;
    base.height = p.height - 40;
    base.x = 20;
    base.y = 20;

    base.child = new Conditional(p);

    let s = base;
    VARIABLES = [];
    for (let i = 0; i < visualRep.length; i++) {
      if (i !== 0) {
        s.child = new Scope(p);
        s = s.child;
      }
      for (let j = 0; j < visualRep[i].length; j++) {
        let variable = new Variable(p);
        variable.name = visualRep[i][j][0];
        variable.value = visualRep[i][j][1];
        s.variables.push(variable);
        VARIABLES.push(variable);
      }
    }
    base.draw();

    if (VARIABLES.length > 0) {
      VARIABLES.forEach(elem => {
        if (p.mouseX > elem.x && p.mouseX < elem.x + VAR_WIDTH && p.mouseY > elem.y && p.mouseY < elem.y + VAR_HEIGHT) {
          elem.font = 15;
          elem.hovering = true;
          elem.draw();

        } else {
          elem.hovering = false;
        }
      });
    }
  };

  p.windowResized = () => {
    resizeCanvasToVisualizer();
    // overflow = false
    p.background('white');
  };


};
