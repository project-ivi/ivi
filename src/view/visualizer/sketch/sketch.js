import Scope from './components/scope';
import { Variable } from './components/variable';
import { VAR_WIDTH, VAR_HEIGHT } from './components/variable';
import { visualRep, onChange, cancelChange } from '../../../interpreter/executor/state';

let VARIABLES = [];
let base = null;
let redraw = false;

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

    if (true) {
      p.background('white');
      console.log('draw')

      base = new Scope(p);
      base.width = p.width - 40;
      base.height = p.height - 40;
      base.x = 20;
      base.y = 20;

      let s = base;
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
          VARIABLES = []
          VARIABLES.push(variable);
        }
      }
      base.draw();
      cancelChange();
      redraw = false;
    }

    if (VARIABLES.length > 0) {

      VARIABLES.forEach(elem => {

        let w;
        if (p.mouseX > elem.x && p.mouseX < elem.x + VAR_WIDTH && p.mouseY > elem.y && p.mouseY < elem.y + VAR_HEIGHT) {
          // Each variable extends a custom amount depending on string length
          if (elem.value.length < 4) {
            w = VAR_WIDTH;
          } else {
            w = VAR_WIDTH + (elem.value.length - 6) * 8.5;
          }

          elem.font = 15;
          elem.width = w;
          elem.hovering = true;

          elem.draw();

        } else {
          elem.width = VAR_WIDTH;
          elem.hovering = false;
          redraw = true;
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
