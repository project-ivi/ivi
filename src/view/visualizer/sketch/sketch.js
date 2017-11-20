import Scope from './components/scope';
import Conditional from './components/conditional';
import { Variable } from './components/variable';
import { VAR_WIDTH, VAR_HEIGHT } from './components/variable';
import { visualRep, changeFlag } from '../../../interpreter/executor/state';

let oldRep = [];
let VARIABLES = [];
let base = null;
let conditional = null;

export default p => {

  p.setup = () => {
    p.createCanvas(0, 0);
    p.background('white');
    p.frameRate(60);
    p.noStroke();
    resizeCanvasToVisualizer();
  };

  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer');
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  }

  p.draw = () => {

    p.background('white');

    if (changeFlag[0]) {
      const last = oldRep.length > 0 ? oldRep[oldRep.length - 1] : null;
      console.log('last: ' + last)
      if (last && last.length > 0 && !(last[0] instanceof Array)) {
        console.log("conditional!")
      }

      changeFlag[0] = false;
    }

    oldRep = visualRep;

    base = new Scope(p);
    base.width = p.width - 40;
    base.height = p.height - 40;
    base.x = 20;
    base.y = 20;

    let s = base;
    VARIABLES = [];
    for (let i = 0; i < visualRep.length; i++) {
      if (i !== 0) {
        s.child = new Scope(p);
        s = s.child;
      }

      // Hack
      for (let j = 0; j < visualRep[i].length; j++) {
        if (visualRep[i][j] instanceof Array) {
          let variable = new Variable(p);
          variable.name = visualRep[i][j][0];
          variable.value = visualRep[i][j][1];
          s.variables.push(variable);
          VARIABLES.push(variable);
        } else {
          if (conditional === null) {
            conditional = new Conditional(p, visualRep[i][j]);
          }
          s.child = conditional;
        }
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
